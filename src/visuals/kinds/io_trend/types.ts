export interface IoTrendInterval {
  intakeMl: number;
  outputMl: number;
}

export interface IoTrendSpec {
  kind: "io_trend";
  time: { unit: "hr" | "shift"; values: number[] };
  intervals: IoTrendInterval[];
  binLabels?: { en: string; zh?: string }[];
  showCumulativeNet?: boolean;
  periodLabel?: { en: string; zh?: string };
  caption?: { en: string; zh?: string };
}
