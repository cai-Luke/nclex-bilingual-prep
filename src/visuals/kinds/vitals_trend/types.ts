export type VitalKey = "hr" | "sbp" | "dbp" | "map" | "rr" | "spo2" | "temp";

export interface VitalsTrendSpec {
  kind: "vitals_trend";
  /** @deprecated use `time` instead. Hour offsets for each reading. */
  timepointsHr?: number[];
  /** Time specification allowing hours or minutes */
  time?: {
    unit: "hr" | "min";
    values: number[];
  };
  series: {
    vital: VitalKey;
    /** Same length as timepointsHr; one value per timepoint. */
    values: number[];
    /** Show the standard normal band for this vital. Default true. */
    showReferenceBand?: boolean;
  }[];
  /** Optional °C vs °F flag for temp formatting/banding. Default 'C'. */
  tempUnit?: "C" | "F";
  caption?: {
    en: string;
    zh?: string;
  };
}
