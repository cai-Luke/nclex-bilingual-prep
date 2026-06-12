export type DeviceType = "pca" | "infusion" | "enteral";

export type DeviceSettingKey =
  | "drug"
  | "concentration"
  | "mode"
  | "demand_dose"
  | "lockout_min"
  | "basal_rate"
  | "limit_1h"
  | "limit_4h"
  | "attempts"
  | "delivered"
  | "rate_ml_hr"
  | "vtbi_ml"
  | "volume_infused_ml"
  | "duration_min";

export interface DeviceSetting {
  key: DeviceSettingKey;
  value?: number;
  text?: string;
  unit?: string;
  flag?: boolean;
}

export interface DeviceScreenSpec {
  kind: "device_screen";
  device: DeviceType;
  title?: { en: string; zh?: string };
  settings: DeviceSetting[];
  caption?: { en: string; zh?: string };
}
