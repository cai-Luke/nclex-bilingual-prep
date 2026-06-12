import type {
  FhrAcceleration,
  FhrDeceleration,
  UterineContraction,
} from "./types";

// NICHD 2008 morphology thresholds. AWHONN's current FHM materials continue
// to use the 2008 NICHD definitions. Early/late offsets below are renderer
// disambiguation tolerances, not clinical thresholds published by NICHD.
export const EARLY_EPS_SEC = 5;
export const LATE_LAG_MIN_SEC = 10;
export const LATE_LAG_MAX_SEC = 90;
export const GRADUAL_MIN_SEC = 30;
export const ABRUPT_MAX_SEC = 30;
export const PROLONGED_MIN_SEC = 120;
export const FEATURE_MIN_DEPTH_BPM = 15;
export const TERM_ACCEL_MIN_RISE_BPM = 15;
export const TERM_ACCEL_MIN_DURATION_SEC = 15;

const cosineBump = (timeSec: number, centerSec: number, durationSec: number) => {
  const halfWidth = durationSec / 2;
  const distance = Math.abs(timeSec - centerSec);
  if (distance >= halfWidth) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * distance / halfWidth));
};

export const accelerationOffsetAt = (
  timeSec: number,
  acceleration: FhrAcceleration,
) => acceleration.riseBpm * cosineBump(timeSec, acceleration.peakSec, acceleration.durationSec);

export const accelerationMorphologyIsValid = (
  acceleration: FhrAcceleration,
) =>
  acceleration.riseBpm >= TERM_ACCEL_MIN_RISE_BPM &&
  acceleration.durationSec >= TERM_ACCEL_MIN_DURATION_SEC &&
  acceleration.durationSec / 2 < ABRUPT_MAX_SEC;

const gradualDecelerationOffsetAt = (
  timeSec: number,
  deceleration: FhrDeceleration,
) => -deceleration.depthBpm * cosineBump(timeSec, deceleration.nadirSec, deceleration.durationSec);

const variableDecelerationOffsetAt = (
  timeSec: number,
  deceleration: FhrDeceleration,
) => {
  const halfWidth = deceleration.durationSec / 2;
  const distance = Math.abs(timeSec - deceleration.nadirSec);
  if (distance >= halfWidth) return 0;
  return -deceleration.depthBpm * (1 - distance / halfWidth);
};

const prolongedDecelerationOffsetAt = (
  timeSec: number,
  deceleration: FhrDeceleration,
) => {
  const halfWidth = deceleration.durationSec / 2;
  const distance = Math.abs(timeSec - deceleration.nadirSec);
  if (distance >= halfWidth) return 0;

  const shoulderWidth = Math.min(30, halfWidth * 0.3);
  const flatHalfWidth = halfWidth - shoulderWidth;
  if (distance <= flatHalfWidth) return -deceleration.depthBpm;

  const shoulderProgress = (distance - flatHalfWidth) / shoulderWidth;
  return -deceleration.depthBpm * 0.5 * (1 + Math.cos(Math.PI * shoulderProgress));
};

export const decelerationOffsetAt = (
  timeSec: number,
  deceleration: FhrDeceleration,
) => {
  if (deceleration.type === "variable") {
    return variableDecelerationOffsetAt(timeSec, deceleration);
  }
  if (deceleration.type === "prolonged") {
    return prolongedDecelerationOffsetAt(timeSec, deceleration);
  }
  return gradualDecelerationOffsetAt(timeSec, deceleration);
};

export const featureOffsetAt = (
  timeSec: number,
  accelerations: readonly FhrAcceleration[],
  decelerations: readonly FhrDeceleration[],
) => {
  const accelerationOffset = accelerations.reduce(
    (sum, acceleration) => sum + accelerationOffsetAt(timeSec, acceleration),
    0,
  );
  const decelerationOffset = decelerations.reduce(
    (sum, deceleration) => sum + decelerationOffsetAt(timeSec, deceleration),
    0,
  );
  return accelerationOffset + decelerationOffset;
};

export const decelerationPhaseIsValid = (
  deceleration: FhrDeceleration,
  contractions: readonly UterineContraction[],
) => {
  const onsetToNadir = deceleration.durationSec / 2;

  if (deceleration.type === "variable") {
    return (
      deceleration.contractionIndex === undefined &&
      deceleration.depthBpm >= FEATURE_MIN_DEPTH_BPM &&
      deceleration.durationSec >= TERM_ACCEL_MIN_DURATION_SEC &&
      deceleration.durationSec < PROLONGED_MIN_SEC &&
      onsetToNadir < ABRUPT_MAX_SEC
    );
  }
  if (deceleration.type === "prolonged") {
    return (
      deceleration.depthBpm >= FEATURE_MIN_DEPTH_BPM &&
      deceleration.durationSec >= PROLONGED_MIN_SEC &&
      deceleration.durationSec < 600
    );
  }

  const contraction =
    deceleration.contractionIndex === undefined
      ? undefined
      : contractions[deceleration.contractionIndex];
  if (!contraction || onsetToNadir < GRADUAL_MIN_SEC) return false;

  const offsetSec = deceleration.nadirSec - contraction.peakSec;
  if (deceleration.type === "early") return Math.abs(offsetSec) <= EARLY_EPS_SEC;
  return offsetSec >= LATE_LAG_MIN_SEC && offsetSec <= LATE_LAG_MAX_SEC;
};
