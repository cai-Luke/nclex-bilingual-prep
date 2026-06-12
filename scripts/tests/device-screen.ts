import type { Question } from "../../src/types";
import {
  deviceScreenModule,
  renderDeviceScreenSvg,
  selfCheckDeviceScreen,
  validateDeviceScreen,
} from "../../src/visuals/kinds/device_screen";
import type { DeviceScreenSpec } from "../../src/visuals/kinds/device_screen/types";
import { measureFieldPanel, type FieldPanelInput } from "../../src/visuals/primitives/table";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const pca: DeviceScreenSpec = {
  kind: "device_screen",
  device: "pca",
  title: { en: "PCA Pump - morphine" },
  settings: [
    { key: "drug", text: "morphine" },
    { key: "mode", text: "PCA+basal" },
    { key: "demand_dose", value: 1, unit: "mg" },
    { key: "lockout_min", value: 10, unit: "min" },
    { key: "basal_rate", value: 1, unit: "mg/hr", flag: true },
    { key: "delivered", value: 9 },
  ],
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const codes = (errors: ReturnType<typeof validateDeviceScreen>) =>
  errors.map((error) => error.code);

assert(codes(validateDeviceScreen({ ...pca, device: "ventilator" as never })).includes("invalid_device"), "invalid device must fail");
assert(codes(validateDeviceScreen({ ...pca, settings: [{ key: "lockout_min", value: 8 }, { key: "lockout_min", value: 10 }] })).includes("duplicate_setting"), "duplicate key must fail");
assert(codes(validateDeviceScreen({ ...pca, settings: [{ key: "tidal_volume" as never, value: 500 }] })).includes("invalid_setting_key"), "unknown key must fail");
assert(codes(validateDeviceScreen({ ...pca, settings: [{ key: "demand_dose", text: "1 mg" }] })).includes("setting_value_invalid"), "numeric setting without value must fail");

const maxDose = selfCheckDeviceScreen({
  kind: "device_screen",
  device: "pca",
  settings: [
    { key: "mode", text: "PCA" },
    { key: "demand_dose", value: 1, unit: "mg" },
    { key: "lockout_min", value: 10, unit: "min" },
  ],
}, questionWithMeta({
  visual_justification: "The learner must compute the hourly maximum from the screen.",
  derived_values_keyed: { max_dose_1h_mg: 6 },
}));
assert(maxDose.length === 0, `correct max hourly dose must pass: ${JSON.stringify(maxDose)}`);

const maxDoseMismatch = selfCheckDeviceScreen({
  kind: "device_screen",
  device: "pca",
  settings: [
    { key: "mode", text: "PCA" },
    { key: "demand_dose", value: 1 },
    { key: "lockout_min", value: 10 },
  ],
}, questionWithMeta({
  visual_justification: "The learner must compute the hourly maximum.",
  derived_values_keyed: { max_dose_1h_mg: 7 },
}));
assert(maxDoseMismatch.some((error) => error.code === "self_check_value_mismatch"), "wrong hourly dose must fail");

const deliveredTotal = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must compute the shift dose from deliveries and basal infusion.",
  shift_hours: 8,
  derived_values_keyed: { delivered_dose_total_mg: 17 },
}));
assert(deliveredTotal.length === 0, `correct basal shift total must pass: ${JSON.stringify(deliveredTotal)}`);

const deliveredMismatch = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must compute the shift dose.",
  shift_hours: 8,
  derived_values_keyed: { delivered_dose_total_mg: 18 },
}));
assert(deliveredMismatch.some((error) => error.code === "self_check_value_mismatch"), "wrong basal shift total must fail");

const keyedSetting = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must identify the displayed basal setting.",
  keyed_settings: [{ key: "basal_rate", reason: "present_in_opioid_naive_pca" }],
}));
assert(keyedSetting.length === 0, `present keyed setting must pass: ${JSON.stringify(keyedSetting)}`);

const absentSetting = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must identify the displayed setting.",
  keyed_settings: [{ key: "limit_1h" }],
}));
assert(absentSetting.some((error) => error.code === "self_check_keyed_setting_absent"), "absent keyed setting must fail");

const unsupported = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must compute an infusion volume.",
  derived_values_keyed: { infusion_volume_ml: 100 },
}));
assert(unsupported.some((error) => error.code === "self_check_derivation_unsupported"), "cross-device derivation must fail");

const noCue = selfCheckDeviceScreen(pca, questionWithMeta({
  visual_justification: "The learner must inspect the settings.",
}));
assert(noCue.some((error) => error.code === "self_check_no_keyed_cue"), "meta without keyed cue must fail");

const missingMeta = selfCheckDeviceScreen(pca, {} as Question);
assert(
  missingMeta.some((error) => error.code === "self_check_missing_justification") &&
    missingMeta.some((error) => error.code === "self_check_no_keyed_cue"),
  "question without meta must fail both necessity checks",
);

const infusion = selfCheckDeviceScreen({
  kind: "device_screen",
  device: "infusion",
  settings: [
    { key: "rate_ml_hr", value: 125, unit: "mL/hr" },
    { key: "duration_min", value: 90, unit: "min" },
  ],
}, questionWithMeta({
  visual_justification: "The learner must calculate infused volume from the screen.",
  round: 0,
  derived_values_keyed: { infusion_volume_ml: 188 },
}));
assert(infusion.length === 0, `rounded infusion volume must pass: ${JSON.stringify(infusion)}`);

const invalidInternal = selfCheckDeviceScreen({
  kind: "device_screen",
  device: "infusion",
  settings: [{ key: "rate_ml_hr", value: Number.NaN }],
}, questionWithMeta({
  visual_justification: "The learner must read the rate.",
  keyed_settings: [{ key: "rate_ml_hr" }],
}));
assert(invalidInternal.some((error) => error.code === "self_check_invalid_setting"), "invalid numeric setting must fail selfCheck");

const missingInternal = selfCheckDeviceScreen({
  kind: "device_screen",
  device: "pca",
  settings: [{ key: "demand_dose" } as never],
}, questionWithMeta({
  visual_justification: "The learner must read the dose.",
  keyed_settings: [{ key: "demand_dose" }],
}));
assert(missingInternal.some((error) => error.code === "self_check_invalid_setting"), "missing numeric value must fail selfCheck");

let malformed: ReturnType<typeof selfCheckDeviceScreen> | undefined;
try {
  malformed = selfCheckDeviceScreen({} as DeviceScreenSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformed?.length === 0, "malformed selfCheck input must return []");

const svg = renderDeviceScreenSvg(pca);
assert(renderDeviceScreenSvg(pca) === svg, "device-screen rendering must be deterministic");
assert(svg.includes('font-family="ui-monospace, monospace"'), "screen values must use monospaced styling");
assert(svg.includes("#f59e0b"), "flagged screen value must render amber");
const expectedPanel: FieldPanelInput = {
  title: "PCA Pump - morphine",
  sections: [{
    fields: [
      { label: "Drug", value: "morphine", emphasis: "normal" },
      { label: "Mode", value: "PCA+basal", emphasis: "normal" },
      { label: "Dose", value: "1 mg", emphasis: "normal" },
      { label: "Lockout", value: "10 min", emphasis: "normal" },
      { label: "Basal", value: "1 mg/hr", emphasis: "flag" },
      { label: "Delivered", value: "9", emphasis: "normal" },
    ],
  }],
  variant: "screen",
  width: 360,
};
const viewBoxHeight = Number(svg.match(/viewBox="0 0 360 ([^"]+)"/)?.[1]);
assert(viewBoxHeight === measureFieldPanel(expectedPanel), "SVG height must match measured screen panel");
assert(
  JSON.stringify(deviceScreenModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "device_screen placement must include numeric fill_in_blank",
);

console.log("device-screen tests passed");
