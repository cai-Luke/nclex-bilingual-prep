import { escapeXml } from "../../primitives/escapeXml";
import { fmt, fmtNum, roundTo } from "../../primitives/graphPaper";
import {
  measureFieldPanel,
  renderFieldPanel,
  type FieldPanelInput,
} from "../../primitives/table";
import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import type {
  DeviceScreenSpec,
  DeviceSetting,
  DeviceSettingKey,
  DeviceType,
} from "./types";

const DEVICES = new Set<DeviceType>(["pca", "infusion", "enteral"]);
const SETTING_KEYS = new Set<DeviceSettingKey>([
  "drug",
  "concentration",
  "mode",
  "demand_dose",
  "lockout_min",
  "basal_rate",
  "limit_1h",
  "limit_4h",
  "attempts",
  "delivered",
  "rate_ml_hr",
  "vtbi_ml",
  "volume_infused_ml",
  "duration_min",
]);
const TEXT_SETTING_KEYS = new Set<DeviceSettingKey>(["drug", "mode", "concentration"]);
const DERIVATION_KEYS = [
  "max_demands_1h",
  "max_dose_1h_mg",
  "delivered_dose_total_mg",
  "infusion_volume_ml",
  "infusion_duration_min",
] as const;
const MAX_SETTING = 100_000;

type DerivationKey = (typeof DERIVATION_KEYS)[number];

const LABELS: Record<DeviceSettingKey, string> = {
  drug: "Drug",
  concentration: "Concentration",
  mode: "Mode",
  demand_dose: "Dose",
  lockout_min: "Lockout",
  basal_rate: "Basal",
  limit_1h: "1 hr limit",
  limit_4h: "4 hr limit",
  attempts: "Attempts",
  delivered: "Delivered",
  rate_ml_hr: "Rate",
  vtbi_ml: "VTBI",
  volume_infused_ml: "Volume infused",
  duration_min: "Duration",
};

const DEFAULT_TITLES: Record<DeviceType, string> = {
  pca: "PCA Pump",
  infusion: "Infusion Pump",
  enteral: "Feeding Pump",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isNonNegativeFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const validateTextPair = (
  value: unknown,
  path: "title" | "caption",
): VisualError[] => {
  if (!isRecord(value) || !nonEmptyString(value.en)) {
    return [{
      path: `${path}.en`,
      code: path === "title" ? "title_en_required" : "caption_en_required",
      message: "is required when present",
    }];
  }
  if (value.zh !== undefined && !nonEmptyString(value.zh)) {
    return [{
      path: `${path}.zh`,
      code: path === "title" ? "title_zh_empty" : "caption_zh_empty",
      message: "must be non-empty when present",
    }];
  }
  return [];
};

export const validateDeviceScreen = (spec: DeviceScreenSpec): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  if (value.kind !== "device_screen") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'device_screen'" }];
  }

  const errors: VisualError[] = [];
  if (typeof value.device !== "string" || !DEVICES.has(value.device as DeviceType)) {
    errors.push({
      path: "device",
      code: "invalid_device",
      message: "must be 'pca', 'infusion', or 'enteral'",
    });
  }

  if (!Array.isArray(value.settings) || value.settings.length === 0) {
    errors.push({
      path: "settings",
      code: "settings_empty",
      message: "must be a non-empty array",
    });
  } else {
    const seen = new Set<string>();
    value.settings.forEach((setting, index) => {
      if (!isRecord(setting) || typeof setting.key !== "string" ||
          !SETTING_KEYS.has(setting.key as DeviceSettingKey)) {
        errors.push({
          path: `settings[${index}].key`,
          code: "invalid_setting_key",
          message: "must be a recognized device setting key",
        });
        return;
      }

      if (seen.has(setting.key)) {
        errors.push({
          path: `settings[${index}].key`,
          code: "duplicate_setting",
          message: "must not repeat a setting key",
        });
      }
      seen.add(setting.key);

      const key = setting.key as DeviceSettingKey;
      if (TEXT_SETTING_KEYS.has(key)) {
        if (!nonEmptyString(setting.text) || setting.value !== undefined) {
          errors.push({
            path: `settings[${index}]`,
            code: "setting_value_invalid",
            message: "text settings require non-empty text and no numeric value",
          });
        }
      } else if (!isNonNegativeFinite(setting.value)) {
        errors.push({
          path: `settings[${index}].value`,
          code: "setting_value_invalid",
          message: "must be a finite non-negative number",
        });
      } else if (setting.value > MAX_SETTING) {
        errors.push({
          path: `settings[${index}].value`,
          code: "setting_out_of_range",
          message: `must be no greater than ${MAX_SETTING}`,
        });
      }

      if (setting.flag !== undefined && typeof setting.flag !== "boolean") {
        errors.push({
          path: `settings[${index}].flag`,
          code: "invalid_flag",
          message: "must be boolean when present",
        });
      }
    });
  }

  if (value.title !== undefined) errors.push(...validateTextPair(value.title, "title"));
  if (value.caption !== undefined) errors.push(...validateTextPair(value.caption, "caption"));
  return errors;
};

const structuralSettings = (value: unknown): Array<Record<string, unknown>> | null => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const settings: Array<Record<string, unknown>> = [];
  for (const setting of value) {
    if (!isRecord(setting) || typeof setting.key !== "string") return null;
    settings.push(setting);
  }
  return settings;
};

const numericSetting = (
  settings: Map<string, Record<string, unknown>>,
  key: DeviceSettingKey,
  positive = false,
): number | null => {
  const value = settings.get(key)?.value;
  if (!isNonNegativeFinite(value) || (positive && value === 0)) return null;
  return value;
};

const includesBasal = (settings: Map<string, Record<string, unknown>>): boolean => {
  const mode = settings.get("mode")?.text;
  return typeof mode === "string" && mode.toLowerCase().includes("basal");
};

const computeDerivation = (
  key: DerivationKey,
  device: unknown,
  settings: Map<string, Record<string, unknown>>,
  meta: Record<string, unknown>,
): number | null => {
  if (key === "max_demands_1h") {
    if (device !== "pca") return null;
    const lockout = numericSetting(settings, "lockout_min", true);
    return lockout === null ? null : Math.floor(60 / lockout);
  }

  if (key === "max_dose_1h_mg") {
    if (device !== "pca") return null;
    const lockout = numericSetting(settings, "lockout_min", true);
    const demandDose = numericSetting(settings, "demand_dose");
    if (lockout === null || demandDose === null) return null;
    const basalRate = includesBasal(settings)
      ? numericSetting(settings, "basal_rate")
      : 0;
    if (basalRate === null) return null;
    return Math.floor(60 / lockout) * demandDose + basalRate;
  }

  if (key === "delivered_dose_total_mg") {
    if (device !== "pca") return null;
    const delivered = numericSetting(settings, "delivered");
    const demandDose = numericSetting(settings, "demand_dose");
    if (delivered === null || demandDose === null) return null;
    let total = delivered * demandDose;
    if (includesBasal(settings)) {
      const basalRate = numericSetting(settings, "basal_rate");
      if (basalRate === null || !isNonNegativeFinite(meta.shift_hours)) return null;
      total += basalRate * meta.shift_hours;
    }
    return total;
  }

  if (device !== "infusion" && device !== "enteral") return null;
  const rate = numericSetting(settings, "rate_ml_hr", true);
  if (rate === null) return null;

  if (key === "infusion_volume_ml") {
    const duration = numericSetting(settings, "duration_min");
    return duration === null ? null : rate * duration / 60;
  }

  const vtbi = numericSetting(settings, "vtbi_ml");
  return vtbi === null ? null : vtbi / rate * 60;
};

export const selfCheckDeviceScreen = (
  spec: DeviceScreenSpec,
  question: unknown,
): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  const settingsList = structuralSettings(value.settings);
  if (value.kind !== "device_screen" || settingsList === null) return [];

  const errors: VisualError[] = [];
  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : {};

  if (!nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const keyedSettings = Array.isArray(meta.keyed_settings) ? meta.keyed_settings : [];
  const keyed = isRecord(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentDerivations = keyed === null
    ? []
    : DERIVATION_KEYS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));

  if (keyedSettings.length === 0 && presentDerivations.length === 0) {
    errors.push({
      path: "meta",
      code: "self_check_no_keyed_cue",
      message: "must declare at least one keyed setting or supported derived value",
    });
  }

  const settings = new Map(settingsList.map((setting) => [String(setting.key), setting]));
  keyedSettings.forEach((entry, index) => {
    const key = isRecord(entry) ? entry.key : undefined;
    if (typeof key !== "string" || !settings.has(key)) {
      errors.push({
        path: `meta.keyed_settings[${index}].key`,
        code: "self_check_keyed_setting_absent",
        message: "must resolve to a setting present on the screen",
      });
    }
  });

  settingsList.forEach((setting, index) => {
    const key = typeof setting.key === "string" ? setting.key as DeviceSettingKey : null;
    if (key !== null && !TEXT_SETTING_KEYS.has(key) && !isNonNegativeFinite(setting.value)) {
      errors.push({
        path: `settings[${index}].value`,
        code: "self_check_invalid_setting",
        message: "must be a finite non-negative number",
      });
    }
  });

  const roundPlaces =
    meta.round === 0 || meta.round === 1 || meta.round === 2 ? meta.round : 0;
  for (const key of presentDerivations) {
    const computed = computeDerivation(key, value.device, settings, meta);
    if (computed === null) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_derivation_unsupported",
        message: `cannot derive ${key} from the declared device settings`,
      });
      continue;
    }
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

const panelInputFor = (spec: DeviceScreenSpec): FieldPanelInput => {
  const defaultTitle = DEFAULT_TITLES[spec.device] ?? "Device Screen";
  const settings = Array.isArray(spec.settings) ? spec.settings : [];
  return {
    title: spec.title?.en ?? defaultTitle,
    sections: [{
      fields: settings.map((setting: DeviceSetting) => ({
        label: LABELS[setting.key] ?? setting.key,
        value: TEXT_SETTING_KEYS.has(setting.key)
          ? setting.text ?? ""
          : `${fmtNum(setting.value ?? 0)}${setting.unit ? ` ${setting.unit}` : ""}`,
        emphasis: setting.flag ? "flag" : "normal",
      })),
    }],
    variant: "screen",
    width: 360,
  };
};

export const renderDeviceScreenSvg = (spec: DeviceScreenSpec): string => {
  const input = panelInputFor(spec);
  const height = measureFieldPanel(input);
  const defaultTitle = DEFAULT_TITLES[spec.device] ?? "Device Screen";
  const ariaLabel = escapeXml(spec.caption?.en ?? spec.title?.en ?? defaultTitle);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${fmt(height)}" role="img" aria-label="${ariaLabel}" data-kind="device_screen">\n${renderFieldPanel(input)}\n</svg>`;
};

const fixtures: VisualKindModule<DeviceScreenSpec>["fixtures"] = {
  valid: [
    {
      kind: "device_screen",
      device: "pca",
      title: { en: "PCA Pump - morphine", zh: "PCA 泵 - 吗啡" },
      settings: [
        { key: "drug", text: "morphine" },
        { key: "concentration", text: "1 mg/mL" },
        { key: "mode", text: "PCA+basal" },
        { key: "demand_dose", value: 1, unit: "mg" },
        { key: "lockout_min", value: 8, unit: "min" },
        { key: "basal_rate", value: 1, unit: "mg/hr", flag: true },
        { key: "limit_4h", value: 20, unit: "mg" },
        { key: "attempts", value: 14 },
        { key: "delivered", value: 9 },
      ],
    },
    {
      kind: "device_screen",
      device: "pca",
      settings: [
        { key: "mode", text: "PCA" },
        { key: "demand_dose", value: 1, unit: "mg" },
        { key: "lockout_min", value: 10, unit: "min" },
      ],
    },
    {
      kind: "device_screen",
      device: "infusion",
      settings: [
        { key: "rate_ml_hr", value: 125, unit: "mL/hr" },
        { key: "duration_min", value: 90, unit: "min" },
      ],
      caption: { en: "Infusion pump settings", zh: "输液泵设置" },
    },
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "device_screen", device: "ventilator", settings: [{ key: "rate_ml_hr", value: 1 }] }, expectCode: "invalid_device" },
    { spec: { kind: "device_screen", device: "pca", settings: [] }, expectCode: "settings_empty" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "tidal_volume", value: 500 }] }, expectCode: "invalid_setting_key" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "lockout_min", value: 8 }, { key: "lockout_min", value: 10 }] }, expectCode: "duplicate_setting" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "demand_dose", text: "1 mg" }] }, expectCode: "setting_value_invalid" },
    { spec: { kind: "device_screen", device: "infusion", settings: [{ key: "rate_ml_hr", value: 999_999 }] }, expectCode: "setting_out_of_range" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "mode", text: "PCA" }], caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "mode", text: "PCA" }], caption: { en: "PCA settings", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const deviceScreenModule: VisualKindModule<DeviceScreenSpec> = {
  kind: "device_screen",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateDeviceScreen,
  selfCheck: selfCheckDeviceScreen,
  renderSvg: renderDeviceScreenSvg,
  fixtures,
};

registerVisual(deviceScreenModule as VisualKindModule);
