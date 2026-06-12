import { escapeXml } from "../../primitives/escapeXml";
import { fmt, fmtNum, roundTo } from "../../primitives/graphPaper";
import {
  measureFieldPanel,
  renderFieldPanel,
  type FieldPanelInput,
} from "../../primitives/table";
import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import type { MedLabelSpec } from "./types";

const AMOUNT_UNITS = new Set(["mg", "mcg", "g", "units", "mEq", "mmol"]);
const PER_UNITS = new Set(["mL", "tablet", "capsule"]);
const MAX_AMOUNT = 1_000_000;
const MAX_PER_QTY = 5_000;
const KEYED_DERIVATIONS = [
  "concentration_per_ml",
  "volume_to_administer_ml",
  "quantity_to_administer_tablets",
  "quantity_to_administer_capsules",
  "rate_ml_per_hr",
] as const;

type DerivationKey = (typeof KEYED_DERIVATIONS)[number];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const validateMedicationLabel = (spec: MedLabelSpec): VisualError[] => {
  const errors: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "medication_label") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'medication_label'" }];
  }
  if (!nonEmptyString(value.drugName)) {
    errors.push({ path: "drugName", code: "drug_name_missing", message: "must be a non-empty string" });
  }
  if (!isPositiveFinite(value.amount)) {
    errors.push({ path: "amount", code: "invalid_amount", message: "must be a finite positive number" });
  } else if (value.amount > MAX_AMOUNT) {
    errors.push({ path: "amount", code: "amount_out_of_range", message: `must be no greater than ${MAX_AMOUNT}` });
  }
  if (typeof value.amountUnit !== "string" || !AMOUNT_UNITS.has(value.amountUnit)) {
    errors.push({ path: "amountUnit", code: "invalid_amount_unit", message: "must be a supported medication amount unit" });
  }
  if (!isPositiveFinite(value.perQty)) {
    errors.push({ path: "perQty", code: "invalid_per_qty", message: "must be a finite positive number" });
  } else if (value.perQty > MAX_PER_QTY) {
    errors.push({ path: "perQty", code: "per_qty_out_of_range", message: `must be no greater than ${MAX_PER_QTY}` });
  }
  if (typeof value.perUnit !== "string" || !PER_UNITS.has(value.perUnit)) {
    errors.push({ path: "perUnit", code: "invalid_per_unit", message: "must be 'mL', 'tablet', or 'capsule'" });
  }
  if (
    value.showDerivedConcentration !== undefined &&
    (typeof value.showDerivedConcentration !== "boolean" ||
      (value.showDerivedConcentration === true && value.perUnit !== "mL"))
  ) {
    errors.push({
      path: "showDerivedConcentration",
      code: "invalid_show_concentration",
      message: "must be boolean and may be true only when perUnit is 'mL'",
    });
  }
  if (value.fields !== undefined) {
    if (!Array.isArray(value.fields)) {
      errors.push({ path: "fields", code: "extra_field_invalid", message: "must be an array" });
    } else {
      value.fields.forEach((field, index) => {
        if (!isRecord(field) || !nonEmptyString(field.label) || !nonEmptyString(field.value)) {
          errors.push({
            path: `fields[${index}]`,
            code: "extra_field_invalid",
            message: "must contain non-empty label and value strings",
          });
        }
      });
    }
  }
  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errors.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errors.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errors;
};

const derivationSupported = (
  key: DerivationKey,
  perUnit: unknown,
  orderKind: unknown,
): boolean => {
  switch (key) {
    case "concentration_per_ml":
      return perUnit === "mL";
    case "volume_to_administer_ml":
      return perUnit === "mL" && orderKind === "dose";
    case "quantity_to_administer_tablets":
      return perUnit === "tablet" && orderKind === "dose";
    case "quantity_to_administer_capsules":
      return perUnit === "capsule" && orderKind === "dose";
    case "rate_ml_per_hr":
      return perUnit === "mL" && orderKind === "dose_rate";
  }
};

export const selfCheckMedicationLabel = (
  spec: MedLabelSpec,
  question: unknown,
): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  if (value.kind !== "medication_label") return [];

  const errors: VisualError[] = [];
  if (!isPositiveFinite(value.amount) || !isPositiveFinite(value.perQty)) {
    errors.push({
      path: "amount",
      code: "self_check_invalid_strength",
      message: "amount and perQty must be finite positive numbers",
    });
    return errors;
  }

  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : null;
  if (meta === null) return errors;

  if (!nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const keyed = isRecord(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentKeys = keyed === null
    ? []
    : KEYED_DERIVATIONS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one supported medication-label derivation",
    });
    return errors;
  }

  const order = isRecord(meta.order) ? meta.order : null;
  const needsOrder = presentKeys.some((key) => key !== "concentration_per_ml");
  const orderValid =
    order !== null &&
    (order.kind === "dose" || order.kind === "dose_rate") &&
    isPositiveFinite(order.value) &&
    order.unit === value.amountUnit &&
    (order.round === undefined || order.round === 0 || order.round === 1 || order.round === 2);

  if (needsOrder && !orderValid) {
    errors.push({
      path: "meta.order",
      code: "self_check_order_invalid",
      message: "must declare a positive same-unit dose or dose_rate order with round 0, 1, or 2",
    });
  }

  const roundPlaces =
    order !== null && (order.round === 0 || order.round === 1 || order.round === 2)
      ? order.round
      : 1;
  const concentration = value.amount / value.perQty;

  for (const key of presentKeys) {
    const orderKind = order?.kind;
    if (!derivationSupported(key, value.perUnit, orderKind)) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_derivation_unsupported",
        message: `cannot derive ${key} from perUnit '${String(value.perUnit)}' and order kind '${String(orderKind)}'`,
      });
      continue;
    }
    if (key !== "concentration_per_ml" && !orderValid) continue;

    const computed = key === "concentration_per_ml"
      ? concentration
      : (order!.value as number) / concentration;
    const rounded = roundTo(computed, roundPlaces);
    if (keyed?.[key] !== rounded) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_value_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${fmtNum(rounded)}`,
      });
    }
  }

  return errors;
};

const panelInputFor = (spec: MedLabelSpec): FieldPanelInput => {
  const fields = [
    { label: "Amount", value: `${fmtNum(spec.amount)} ${spec.amountUnit}` },
    {
      label: spec.perUnit === "mL" ? "Volume" : "Per unit",
      value: `${fmtNum(spec.perQty)} ${spec.perUnit}`,
    },
  ];
  if (spec.showDerivedConcentration === true && spec.perUnit === "mL") {
    fields.push({
      label: "Concentration",
      value: `${fmtNum(spec.amount / spec.perQty)} ${spec.amountUnit}/mL`,
    });
  }
  if (Array.isArray(spec.fields)) {
    fields.push(...spec.fields.map((field) => ({ label: field.label, value: field.value })));
  }
  return {
    title: spec.drugName,
    sections: [{ fields }],
    variant: "label",
    width: 360,
  };
};

export const renderMedicationLabelSvg = (spec: MedLabelSpec): string => {
  const input = panelInputFor(spec);
  const height = measureFieldPanel(input);
  const ariaLabel = escapeXml(spec.caption?.en ?? spec.drugName);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${fmt(height)}" role="img" aria-label="${ariaLabel}" data-kind="medication_label">\n${renderFieldPanel(input)}\n</svg>`;
};

const fixtures: VisualKindModule<MedLabelSpec>["fixtures"] = {
  valid: [
    {
      kind: "medication_label",
      drugName: "Heparin Sodium",
      amount: 25_000,
      amountUnit: "units",
      perQty: 250,
      perUnit: "mL",
      showDerivedConcentration: false,
      fields: [{ label: "Diluent", value: "D5W" }],
      caption: { en: "Heparin premix label", zh: "肝素预混液标签" },
    },
    {
      kind: "medication_label",
      drugName: "Digoxin",
      amount: 0.5,
      amountUnit: "mg",
      perQty: 2,
      perUnit: "mL",
    },
    {
      kind: "medication_label",
      drugName: "Levothyroxine",
      amount: 0.05,
      amountUnit: "mg",
      perQty: 1,
      perUnit: "tablet",
    },
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "medication_label", drugName: "", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL" }, expectCode: "drug_name_missing" },
    { spec: { kind: "medication_label", drugName: "X", amount: 0, amountUnit: "mg", perQty: 1, perUnit: "mL" }, expectCode: "invalid_amount" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mL", perQty: 1, perUnit: "mL" }, expectCode: "invalid_amount_unit" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: -1, perUnit: "mL" }, expectCode: "invalid_per_qty" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "vial" }, expectCode: "invalid_per_unit" },
    { spec: { kind: "medication_label", drugName: "X", amount: 9_999_999, amountUnit: "units", perQty: 1, perUnit: "mL" }, expectCode: "amount_out_of_range" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "tablet", showDerivedConcentration: true }, expectCode: "invalid_show_concentration" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", fields: [{ label: "", value: "x" }] }, expectCode: "extra_field_invalid" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const medicationLabelModule: VisualKindModule<MedLabelSpec> = {
  kind: "medication_label",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateMedicationLabel,
  selfCheck: selfCheckMedicationLabel,
  renderSvg: renderMedicationLabelSvg,
  fixtures,
};

registerVisual(medicationLabelModule as VisualKindModule);
