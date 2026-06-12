import { escapeXml } from "../../primitives/escapeXml";
import { fmt } from "../../primitives/graphPaper";
import { registerVisual, type VisualError, type VisualKindModule } from "../../registry";
import {
  createChannelLayout,
  CTG_PX_PER_SEC,
  normalizeFetalMonitoringSpec,
  renderChannels,
  VARIABILITY_PEAK_TO_TROUGH_BPM,
} from "./channels";
import {
  accelerationMorphologyIsValid,
  decelerationPhaseIsValid,
} from "./features";
import type {
  DecelType,
  FetalMonitoringSpec,
  FhrDeceleration,
  FhrVariability,
} from "./types";

const VARIABILITY = ["absent", "minimal", "moderate", "marked"] as const;
const DECEL_TYPES = ["early", "late", "variable", "prolonged"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const inRange = (value: unknown, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

export const validateFetalMonitoring = (spec: FetalMonitoringSpec): VisualError[] => {
  const errors: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;
  const durationSec = inRange(value.durationSec, 120, 1200)
    ? (value.durationSec as number)
    : 600;

  if (value.kind !== "fetal_monitoring") {
    errors.push({ path: "kind", code: "invalid_kind", message: "must be fetal_monitoring" });
  }

  if (value.baselineFhr === undefined) {
    errors.push({ path: "baselineFhr", code: "baseline_required", message: "is required" });
  } else if (!inRange(value.baselineFhr, 50, 220)) {
    errors.push({ path: "baselineFhr", code: "baseline_out_of_range", message: "must be 50 to 220 bpm" });
  }

  if (!VARIABILITY.includes(value.variability as (typeof VARIABILITY)[number])) {
    errors.push({ path: "variability", code: "invalid_variability", message: "is invalid" });
  }

  if (value.durationSec !== undefined && !inRange(value.durationSec, 120, 1200)) {
    errors.push({ path: "durationSec", code: "duration_out_of_range", message: "must be 120 to 1200 seconds" });
  }

  if (
    value.seed !== undefined &&
    (typeof value.seed !== "number" || !Number.isInteger(value.seed) || value.seed < 0)
  ) {
    errors.push({ path: "seed", code: "seed_out_of_range", message: "must be a non-negative integer" });
  }

  const contractions = Array.isArray(value.contractions) ? value.contractions : [];
  if (value.contractions !== undefined && !Array.isArray(value.contractions)) {
    errors.push({ path: "contractions", code: "contraction_out_of_range", message: "must be an array" });
  }
  contractions.forEach((contraction, index) => {
    const valid =
      isRecord(contraction) &&
      inRange(contraction.peakSec, 0, durationSec) &&
      (contraction.amplitudeMmHg === undefined || inRange(contraction.amplitudeMmHg, 5, 100)) &&
      (contraction.durationSec === undefined || inRange(contraction.durationSec, 20, 180));
    if (!valid) {
      errors.push({
        path: `contractions[${index}]`,
        code: "contraction_out_of_range",
        message: "contains an invalid peak, amplitude, or duration",
      });
    }
  });

  const accelerations = Array.isArray(value.accelerations) ? value.accelerations : [];
  if (value.accelerations !== undefined && !Array.isArray(value.accelerations)) {
    errors.push({ path: "accelerations", code: "acceleration_out_of_range", message: "must be an array" });
  }
  accelerations.forEach((acceleration, index) => {
    const valid =
      isRecord(acceleration) &&
      inRange(acceleration.peakSec, 0, durationSec) &&
      inRange(acceleration.riseBpm, 1, 60) &&
      inRange(acceleration.durationSec, 5, 120);
    if (!valid) {
      errors.push({
        path: `accelerations[${index}]`,
        code: "acceleration_out_of_range",
        message: "contains an invalid peak, rise, or duration",
      });
    }
  });

  const decelerations = Array.isArray(value.decelerations) ? value.decelerations : [];
  if (value.decelerations !== undefined && !Array.isArray(value.decelerations)) {
    errors.push({ path: "decelerations", code: "deceleration_out_of_range", message: "must be an array" });
  }
  decelerations.forEach((deceleration, index) => {
    if (!isRecord(deceleration)) {
      errors.push({
        path: `decelerations[${index}]`,
        code: "deceleration_out_of_range",
        message: "must be an object",
      });
      return;
    }
    if (!DECEL_TYPES.includes(deceleration.type as (typeof DECEL_TYPES)[number])) {
      errors.push({
        path: `decelerations[${index}].type`,
        code: "invalid_decel_type",
        message: "is invalid",
      });
    }
    if (
      !inRange(deceleration.nadirSec, 0, durationSec) ||
      !inRange(deceleration.depthBpm, 1, 120) ||
      !inRange(deceleration.durationSec, 5, 600)
    ) {
      errors.push({
        path: `decelerations[${index}]`,
        code: "deceleration_out_of_range",
        message: "contains an invalid nadir, depth, or duration",
      });
    }
    if (deceleration.type === "early" || deceleration.type === "late") {
      if (
        typeof deceleration.contractionIndex !== "number" ||
        !Number.isInteger(deceleration.contractionIndex) ||
        deceleration.contractionIndex < 0 ||
        deceleration.contractionIndex >= contractions.length
      ) {
        errors.push({
          path: `decelerations[${index}].contractionIndex`,
          code: "decel_contraction_index_invalid",
          message: "must index an existing contraction",
        });
      }
    }
    if (deceleration.type === "variable" && deceleration.contractionIndex !== undefined) {
      errors.push({
        path: `decelerations[${index}].contractionIndex`,
        code: "variable_decel_coupled",
        message: "must be omitted for variable decelerations",
      });
    }
  });

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errors.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errors.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errors;
};

export const renderFetalMonitoringSvg = (input: FetalMonitoringSpec): string => {
  const spec = normalizeFetalMonitoringSpec(input);
  const layout = createChannelLayout(spec.durationSec);
  const ariaLabel = escapeXml(spec.caption?.en ?? "Fetal monitoring tracing");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(layout.width)} ${fmt(layout.height)}" role="img" aria-label="${ariaLabel}" data-kind="fetal_monitoring" data-baseline-fhr="${fmt(spec.baselineFhr)}" data-variability="${spec.variability}" data-variability-peak-to-trough-bpm="${fmt(VARIABILITY_PEAK_TO_TROUGH_BPM[spec.variability])}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(CTG_PX_PER_SEC)}">${renderChannels(spec)}</svg>`;
};

const structuralSpec = (value: Record<string, unknown>) => {
  if (
    value.kind !== "fetal_monitoring" ||
    !inRange(value.baselineFhr, 50, 220) ||
    !VARIABILITY.includes(value.variability as FhrVariability)
  ) {
    return null;
  }
  const contractions = Array.isArray(value.contractions) ? value.contractions : [];
  const accelerations = Array.isArray(value.accelerations) ? value.accelerations : [];
  const decelerations = Array.isArray(value.decelerations) ? value.decelerations : [];
  if (
    !contractions.every(isRecord) ||
    !accelerations.every(isRecord) ||
    !decelerations.every(isRecord)
  ) {
    return null;
  }
  return {
    contractions: contractions as unknown as NonNullable<FetalMonitoringSpec["contractions"]>,
    accelerations: accelerations as unknown as NonNullable<FetalMonitoringSpec["accelerations"]>,
    decelerations: decelerations as unknown as FhrDeceleration[],
  };
};

export const selfCheckFetalMonitoring = (
  spec: FetalMonitoringSpec,
  question: unknown,
): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  const structural = structuralSpec(value);
  if (structural === null) return [];

  const errors: VisualError[] = [];
  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : {};
  if (!nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const expectedPattern = isRecord(meta.expected_pattern) ? meta.expected_pattern : {};
  const expectedDecelerations = Array.isArray(expectedPattern.decelerations)
    ? expectedPattern.decelerations.filter(
        (entry): entry is DecelType =>
          typeof entry === "string" && DECEL_TYPES.includes(entry as DecelType),
      )
    : [];
  const hasExpectedVariability = VARIABILITY.includes(
    expectedPattern.variability as FhrVariability,
  );
  const hasExpectedAccelerations = typeof expectedPattern.accelerations_present === "boolean";
  if (
    expectedDecelerations.length === 0 &&
    !hasExpectedVariability &&
    !hasExpectedAccelerations
  ) {
    errors.push({
      path: "meta.expected_pattern",
      code: "self_check_no_keyed_pattern",
      message: "must declare at least one supported tracing feature",
    });
  }

  structural.decelerations.forEach((deceleration, index) => {
    if (!decelerationPhaseIsValid(deceleration, structural.contractions)) {
      const code =
        deceleration.type === "early"
          ? "self_check_early_phase"
          : deceleration.type === "late"
            ? "self_check_late_phase"
            : deceleration.type === "variable"
              ? "self_check_variable_not_abrupt"
              : "self_check_prolonged_duration";
      errors.push({
        path: `decelerations[${index}]`,
        code,
        message: `timing is inconsistent with declared ${deceleration.type} morphology`,
      });
    }
  });

  structural.accelerations.forEach((acceleration, index) => {
    if (!accelerationMorphologyIsValid(acceleration)) {
      errors.push({
        path: `accelerations[${index}]`,
        code: "self_check_acceleration_morphology",
        message: "must satisfy the v1 term acceleration morphology",
      });
    }
  });

  const actualTypes = new Set(structural.decelerations.map((deceleration) => deceleration.type));
  expectedDecelerations.forEach((type, index) => {
    if (!actualTypes.has(type)) {
      errors.push({
        path: `meta.expected_pattern.decelerations[${index}]`,
        code: "self_check_pattern_absent",
        message: `declared ${type} pattern is absent`,
      });
    }
  });

  if (
    hasExpectedVariability &&
    expectedPattern.variability !== value.variability
  ) {
    errors.push({
      path: "meta.expected_pattern.variability",
      code: "self_check_variability_mismatch",
      message: "does not match the rendered variability category",
    });
  }

  if (
    hasExpectedAccelerations &&
    expectedPattern.accelerations_present !== (structural.accelerations.length > 0)
  ) {
    errors.push({
      path: "meta.expected_pattern.accelerations_present",
      code: "self_check_accel_mismatch",
      message: "does not match acceleration presence in the tracing",
    });
  }

  const variabilityRange =
    VARIABILITY_PEAK_TO_TROUGH_BPM[value.variability as FhrVariability];
  if (!Number.isFinite(variabilityRange)) {
    errors.push({
      path: "variability",
      code: "self_check_variability_amplitude",
      message: "does not map to a deterministic amplitude",
    });
  }

  return errors;
};

const fixtures: VisualKindModule<FetalMonitoringSpec>["fixtures"] = {
  valid: [
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      contractions: [{ peakSec: 100 }, { peakSec: 220 }],
      accelerations: [{ peakSec: 160, riseBpm: 20, durationSec: 30 }],
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      seed: 7,
      contractions: [{ peakSec: 90 }, { peakSec: 210 }],
      decelerations: [
        { type: "early", nadirSec: 90, depthBpm: 25, durationSec: 70, contractionIndex: 0 },
        { type: "early", nadirSec: 210, depthBpm: 25, durationSec: 70, contractionIndex: 1 },
      ],
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 135,
      variability: "minimal",
      seed: 17,
      contractions: [{ peakSec: 90 }, { peakSec: 210 }],
      decelerations: [
        { type: "late", nadirSec: 110, depthBpm: 30, durationSec: 70, contractionIndex: 0 },
        { type: "late", nadirSec: 230, depthBpm: 30, durationSec: 70, contractionIndex: 1 },
      ],
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 145,
      variability: "moderate",
      seed: 23,
      contractions: [{ peakSec: 120 }, { peakSec: 240 }],
      decelerations: [
        { type: "variable", nadirSec: 70, depthBpm: 45, durationSec: 24 },
        { type: "variable", nadirSec: 190, depthBpm: 40, durationSec: 20 },
      ],
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      seed: 29,
      contractions: [{ peakSec: 80 }, { peakSec: 230 }],
      decelerations: [
        { type: "prolonged", nadirSec: 155, depthBpm: 35, durationSec: 180 },
      ],
      caption: { en: "Fetal monitoring tracing", zh: "胎儿监护图" },
    },
  ],
  invalid: [
    { spec: { kind: "rhythm_strip", baselineFhr: 140, variability: "moderate" }, expectCode: "invalid_kind" },
    { spec: { kind: "fetal_monitoring", variability: "moderate" }, expectCode: "baseline_required" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 400, variability: "moderate" }, expectCode: "baseline_out_of_range" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "wandering" }, expectCode: "invalid_variability" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", durationSec: 30 }, expectCode: "duration_out_of_range" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", seed: -1 }, expectCode: "seed_out_of_range" },
    {
      spec: {
        kind: "fetal_monitoring",
        baselineFhr: 140,
        variability: "moderate",
        contractions: [{ peakSec: 700 }],
      },
      expectCode: "contraction_out_of_range",
    },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const fetalMonitoringModule: VisualKindModule<FetalMonitoringSpec> = {
  kind: "fetal_monitoring",
  validate: validateFetalMonitoring,
  selfCheck: selfCheckFetalMonitoring,
  renderSvg: renderFetalMonitoringSvg,
  fixtures,
};

registerVisual(fetalMonitoringModule as VisualKindModule);
