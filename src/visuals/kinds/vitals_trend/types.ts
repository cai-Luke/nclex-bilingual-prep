export type VitalKey = "hr" | "sbp" | "dbp" | "map" | "rr" | "spo2" | "temp";

export interface VitalsTrendSpec {
  kind: "vitals_trend";
  /** Hour offsets for each reading; shared x-axis across series. */
  timepointsHr: number[];
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
