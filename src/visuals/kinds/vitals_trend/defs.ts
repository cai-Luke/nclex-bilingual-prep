import type { VitalKey } from "./types";

export interface VitalDef {
  label: string;
  unit: string;
  axis: "left" | "right";
  styleRole: string;
  range: { min: number; max: number };
  normal: (unit?: "C" | "F") => { low: number; high: number };
}

export const VITAL_DEFS: Record<VitalKey, VitalDef> = {
  hr:   { label: "HR",   unit: "bpm",  axis: "left",  styleRole: "red",     range: { min: 10, max: 300 }, normal: () => ({ low: 60, high: 100 }) },
  sbp:  { label: "SBP",  unit: "mmHg", axis: "left",  styleRole: "blue",    range: { min: 40, max: 300 }, normal: () => ({ low: 90, high: 120 }) },
  dbp:  { label: "DBP",  unit: "mmHg", axis: "left",  styleRole: "blue",    range: { min: 20, max: 200 }, normal: () => ({ low: 60, high: 80 }) },
  map:  { label: "MAP",  unit: "mmHg", axis: "left",  styleRole: "purple",  range: { min: 30, max: 250 }, normal: () => ({ low: 70, high: 100 }) },
  rr:   { label: "RR",   unit: "/min", axis: "left",  styleRole: "green",   range: { min: 2, max: 80 },   normal: () => ({ low: 12, high: 20 }) },
  spo2: { label: "SpO2", unit: "%",    axis: "right", styleRole: "slate",   range: { min: 50, max: 100 }, normal: () => ({ low: 95, high: 100 }) },
  temp: { label: "Temp", unit: "°C",   axis: "right", styleRole: "orange",  range: { min: 30, max: 110 }, normal: (u) => u === "F" ? ({ low: 97.7, high: 99.5 }) : ({ low: 36.5, high: 37.5 }) },
};
