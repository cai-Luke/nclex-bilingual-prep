import type { Question } from "../../src/types";
import {
  medicationLabelModule,
  renderMedicationLabelSvg,
  selfCheckMedicationLabel,
  validateMedicationLabel,
} from "../../src/visuals/kinds/medication_label";
import type { MedLabelSpec } from "../../src/visuals/kinds/medication_label/types";
import {
  measureFieldPanel,
  renderFieldPanel,
  type FieldPanelInput,
} from "../../src/visuals/primitives/table";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const heparin: MedLabelSpec = {
  kind: "medication_label",
  drugName: "Heparin Sodium",
  amount: 25_000,
  amountUnit: "units",
  perQty: 250,
  perUnit: "mL",
  fields: [{ label: "Diluent", value: "D5W" }],
};

const digoxin: MedLabelSpec = {
  kind: "medication_label",
  drugName: "Digoxin",
  amount: 0.5,
  amountUnit: "mg",
  perQty: 2,
  perUnit: "mL",
};

const levothyroxine: MedLabelSpec = {
  kind: "medication_label",
  drugName: "Levothyroxine",
  amount: 0.05,
  amountUnit: "mg",
  perQty: 1,
  perUnit: "tablet",
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const codes = (errors: ReturnType<typeof validateMedicationLabel>) =>
  errors.map((error) => error.code);

assert(codes(validateMedicationLabel({ ...heparin, amount: 0 })).includes("invalid_amount"), "zero amount must fail");
assert(codes(validateMedicationLabel({ ...heparin, perUnit: "vial" as never })).includes("invalid_per_unit"), "invalid perUnit must fail");
assert(codes(validateMedicationLabel({ ...heparin, amount: 9_999_999 })).includes("amount_out_of_range"), "oversized amount must fail");
assert(codes(validateMedicationLabel({ ...heparin, fields: [{ label: "", value: "D5W" }] })).includes("extra_field_invalid"), "empty extra-field label must fail");

const heparinCheck = selfCheckMedicationLabel(heparin, questionWithMeta({
  visual_justification: "The learner must read the bag strength to compute the infusion rate.",
  order: { kind: "dose_rate", value: 1000, unit: "units", round: 0 },
  derived_values_keyed: { rate_ml_per_hr: 10 },
}));
assert(heparinCheck.length === 0, `heparin rate must pass: ${JSON.stringify(heparinCheck)}`);

const digoxinCheck = selfCheckMedicationLabel(digoxin, questionWithMeta({
  visual_justification: "The learner must read the vial strength to compute draw-up volume.",
  order: { kind: "dose", value: 0.125, unit: "mg", round: 1 },
  derived_values_keyed: { volume_to_administer_ml: 0.5 },
}));
assert(digoxinCheck.length === 0, `digoxin volume must pass: ${JSON.stringify(digoxinCheck)}`);

const mismatch = selfCheckMedicationLabel(digoxin, questionWithMeta({
  visual_justification: "The learner must compute the volume.",
  order: { kind: "dose", value: 0.125, unit: "mg", round: 1 },
  derived_values_keyed: { volume_to_administer_ml: 0.6 },
}));
assert(mismatch.some((error) => error.code === "self_check_value_mismatch"), "wrong keyed volume must fail");

const unitMismatch = selfCheckMedicationLabel(digoxin, questionWithMeta({
  visual_justification: "The learner must compute the volume.",
  order: { kind: "dose", value: 125, unit: "mcg", round: 1 },
  derived_values_keyed: { volume_to_administer_ml: 0.5 },
}));
assert(unitMismatch.some((error) => error.code === "self_check_order_invalid"), "cross-unit order must fail");

const concentration = selfCheckMedicationLabel(digoxin, questionWithMeta({
  visual_justification: "The learner must derive the per-mL concentration from the label.",
  order: { kind: "none", round: 2 },
  derived_values_keyed: { concentration_per_ml: 0.25 },
}));
assert(concentration.length === 0, `concentration-only derivation must pass: ${JSON.stringify(concentration)}`);

const unsupported = selfCheckMedicationLabel(levothyroxine, questionWithMeta({
  visual_justification: "The learner must compute a rate.",
  order: { kind: "dose_rate", value: 0.1, unit: "mg", round: 1 },
  derived_values_keyed: { rate_ml_per_hr: 2 },
}));
assert(unsupported.some((error) => error.code === "self_check_derivation_unsupported"), "tablet rate derivation must fail");

let malformed: ReturnType<typeof selfCheckMedicationLabel> | undefined;
try {
  malformed = selfCheckMedicationLabel({} as MedLabelSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformed?.length === 0, "malformed selfCheck input must return []");

const svg = renderMedicationLabelSvg(heparin);
assert(renderMedicationLabelSvg(heparin) === svg, "medication-label rendering must be deterministic");
assert(svg.includes(">25,000 units<"), "large amount must use fixed thousands grouping");
const viewBoxHeight = Number(svg.match(/viewBox="0 0 360 ([^"]+)"/)?.[1]);
const expectedPanel: FieldPanelInput = {
  title: "Heparin Sodium",
  sections: [{
    fields: [
      { label: "Amount", value: "25,000 units" },
      { label: "Volume", value: "250 mL" },
      { label: "Diluent", value: "D5W" },
    ],
  }],
  variant: "label",
  width: 360,
};
assert(viewBoxHeight === measureFieldPanel(expectedPanel), "SVG height must match measured panel height");

const flaggedLabel = renderFieldPanel({
  sections: [{ fields: [{ label: "<script>", value: "unsafe", emphasis: "flag" }] }],
});
assert(flaggedLabel.includes('<g class="field-panel">'), "label panel must render its group");
assert(flaggedLabel.includes("#fef9c3"), "label flag must render a yellow highlight");
assert(flaggedLabel.includes("&lt;script&gt;"), "field labels must be XML-escaped");

const flaggedScreen = renderFieldPanel({
  variant: "screen",
  sections: [{ fields: [{ label: "Pressure", value: "99", emphasis: "flag" }] }],
});
assert(flaggedScreen.includes('<g class="field-panel">'), "screen panel must render its group");
assert(flaggedScreen.includes("#f59e0b"), "screen flag must render amber value text");
assert(
  JSON.stringify(medicationLabelModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "medication_label placement must include numeric fill_in_blank",
);

console.log("medication-label tests passed");
