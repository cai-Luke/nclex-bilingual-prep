export type FhrVariability = "absent" | "minimal" | "moderate" | "marked";

export type DecelType = "early" | "late" | "variable" | "prolonged";

export interface UterineContraction {
  /** Peak time on the shared axis, in seconds from strip start. */
  peakSec: number;
  /** Peak uterine activity above resting tone, in mmHg. Default 50. */
  amplitudeMmHg?: number;
  /** Total onset-to-offset width, in seconds. Default 60. */
  durationSec?: number;
}

export interface FhrAcceleration {
  /** V1 models the >=32-week 15 bpm by 15 second acceleration definition. */
  peakSec: number;
  riseBpm: number;
  durationSec: number;
}

export interface FhrDeceleration {
  type: DecelType;
  nadirSec: number;
  depthBpm: number;
  durationSec: number;
  /** Required for early/late. Omitted for variable because variable
   * decelerations have no fixed contraction-phase relationship. */
  contractionIndex?: number;
}

export interface FetalMonitoringSpec {
  kind: "fetal_monitoring";
  /** Strip length in seconds. Default 600. */
  durationSec?: number;
  /** Baseline fetal heart rate, in bpm. */
  baselineFhr: number;
  variability: FhrVariability;
  /** Seed for deterministic variability texture. Default 0. */
  seed?: number;
  contractions?: UterineContraction[];
  accelerations?: FhrAcceleration[];
  decelerations?: FhrDeceleration[];
  caption?: {
    en: string;
    zh?: string;
  };
}
