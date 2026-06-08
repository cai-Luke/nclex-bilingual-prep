import { fmt, pxPerSec, renderGrid, secondsToPx } from "../../primitives/graphPaper";
import { type VisualError, type VisualKindModule } from "../../registry";
import { type CapnographySpec } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const bounded = (
  value: unknown,
  path: string,
  min: number,
  max: number,
  code: string,
  errs: VisualError[],
  options: { integer?: boolean; exclusiveMin?: boolean; exclusiveMax?: boolean } = {},
) => {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errs.push({ path, code: `${code}_not_number`, message: "must be a number" });
    return;
  }
  if (options.integer && !Number.isInteger(value)) errs.push({ path, code: `${code}_not_integer`, message: "must be an integer" });
  
  const tooSmall = options.exclusiveMin ? value <= min : value < min;
  const tooLarge = options.exclusiveMax ? value >= max : value > max;
  
  if (tooSmall || tooLarge) {
    const minStr = options.exclusiveMin ? `> ${min}` : `>= ${min}`;
    const maxStr = options.exclusiveMax ? `< ${max}` : `<= ${max}`;
    errs.push({ path, code, message: `must be ${minStr} and ${maxStr}` });
  }
};

export const validateCapnography = (spec: CapnographySpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (!["normal", "shark_fin", "flat", "rosc", "rebreathing"].includes(value.pattern as string)) {
    errs.push({ path: "pattern", code: "bad_pattern", message: "is invalid" });
  }

  bounded(value.etco2, "etco2", 0, 150, "etco2_out_of_range", errs);
  if (value.etco2 === undefined) errs.push({ path: "etco2", code: "etco2_required", message: "is required" });
  
  if (value.pattern === "flat" && value.etco2 !== 0) {
    errs.push({ path: "etco2", code: "flat_nonzero_etco2", message: "must be 0 for flat pattern" });
  }

  bounded(value.respiratoryRate, "respiratoryRate", 4, 60, "rr_out_of_range", errs);
  if (value.respiratoryRate === undefined) errs.push({ path: "respiratoryRate", code: "rr_required", message: "is required" });

  bounded(value.durationSec, "durationSec", 5, 60, "duration_out_of_range", errs);

  if (value.pattern === "shark_fin") {
    if (value.severity === undefined) {
      errs.push({ path: "severity", code: "severity_required", message: "is required for shark_fin pattern" });
    } else {
      bounded(value.severity, "severity", 0, 1, "severity_out_of_range", errs, { exclusiveMin: true });
    }
  } else if (value.severity !== undefined) {
    errs.push({ path: "severity", code: "severity_disallowed", message: "is only allowed for shark_fin pattern" });
  }

  if (value.pattern === "rebreathing") {
    if (value.baselineEtco2 === undefined) {
      errs.push({ path: "baselineEtco2", code: "baseline_required", message: "is required for rebreathing pattern" });
    } else {
      bounded(value.baselineEtco2, "baselineEtco2", 0, value.etco2 as number, "baseline_out_of_range", errs, { exclusiveMin: true, exclusiveMax: true });
    }
  } else if (value.baselineEtco2 !== undefined) {
    errs.push({ path: "baselineEtco2", code: "baseline_disallowed", message: "is only allowed for rebreathing pattern" });
  }

  if (value.pattern === "rosc") {
    if (value.rosc === undefined) {
      errs.push({ path: "rosc", code: "rosc_required", message: "is required for rosc pattern" });
    } else if (!isRecord(value.rosc)) {
      errs.push({ path: "rosc", code: "rosc_not_object", message: "must be an object" });
    } else {
      const rosc = value.rosc;
      // The three sub-fields ARE the finding; a partial object must not render a
      // misleading (or NaN) strip. `bounded` skips undefined, so require them here.
      if (rosc.lowEtco2 === undefined) errs.push({ path: "rosc.lowEtco2", code: "rosc_low_required", message: "is required" });
      if (rosc.highEtco2 === undefined) errs.push({ path: "rosc.highEtco2", code: "rosc_high_required", message: "is required" });
      if (rosc.stepAtSec === undefined) errs.push({ path: "rosc.stepAtSec", code: "rosc_step_required", message: "is required" });
      bounded(rosc.lowEtco2, "rosc.lowEtco2", 0, 150, "rosc_low_out_of_range", errs, { exclusiveMin: true });
      bounded(rosc.highEtco2, "rosc.highEtco2", (rosc.lowEtco2 as number) || 0, 150, "rosc_high_out_of_range", errs, { exclusiveMin: true });
      bounded(rosc.stepAtSec, "rosc.stepAtSec", 0, (value.durationSec as number) || 15, "rosc_step_out_of_range", errs, { exclusiveMin: true, exclusiveMax: true });
    }
  } else if (value.rosc !== undefined) {
    errs.push({ path: "rosc", code: "rosc_disallowed", message: "is only allowed for rosc pattern" });
  }
  
  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errs;
};

type NormalizedCapnographySpec = Required<Pick<CapnographySpec, "durationSec">> & CapnographySpec;

export const normalizeSpec = (spec: CapnographySpec): NormalizedCapnographySpec => ({
  ...spec,
  durationSec: spec.durationSec ?? 15,
});

export const getCurrentEtco2 = (timeSec: number, spec: NormalizedCapnographySpec): number => {
  if (spec.pattern === "rosc" && spec.rosc) {
    return timeSec < spec.rosc.stepAtSec ? spec.rosc.lowEtco2 : spec.rosc.highEtco2;
  }
  return spec.etco2;
};

export const getWaveform = (u: number, spec: NormalizedCapnographySpec, currentEtco2: number): number => {
  if (spec.pattern === "flat") return 0;
  
  const baseline = spec.pattern === "rebreathing" ? (spec.baselineEtco2 ?? 0) : 0;
  
  if (u < 0) return baseline;
  
  // Phase 0: Downstroke
  if (u > 0.45 && u <= 0.5) {
    const down_t = (u - 0.45) / 0.05;
    return currentEtco2 - (currentEtco2 - baseline) * down_t;
  }
  
  // Phase 1: Baseline
  if (u > 0.5) {
    return baseline;
  }
  
  // Expiration phase (0 to 0.45)
  if (spec.pattern === "shark_fin") {
    const sev = spec.severity ?? 0.5;
    const phase2_end = 0.05 + 0.3 * sev;
    const phase2_amp = currentEtco2 * (0.95 - 0.45 * sev);
    if (u <= phase2_end) {
      return baseline + (phase2_amp - baseline) * (u / phase2_end);
    } else {
      return phase2_amp + (currentEtco2 - phase2_amp) * ((u - phase2_end) / (0.45 - phase2_end));
    }
  }
  
  // Normal / rebreathing / rosc
  if (u <= 0.05) {
    const phase2_amp = currentEtco2 * 0.95;
    return baseline + (phase2_amp - baseline) * (u / 0.05);
  } else {
    const phase2_amp = currentEtco2 * 0.95;
    return phase2_amp + (currentEtco2 - phase2_amp) * ((u - 0.05) / 0.40);
  }
};

export const selfCheckCapnography = (spec: CapnographySpec, _question: any): VisualError[] => {
  const errs: VisualError[] = [];
  const normalized = normalizeSpec(spec);
  const period = 60 / normalized.respiratoryRate;
  
  if (normalized.pattern === 'rosc' && normalized.rosc) {
    const preTime = Math.max(0, normalized.rosc.stepAtSec - period);
    const postTime = Math.min(normalized.durationSec, normalized.rosc.stepAtSec + period);
    
    const preEtco2 = getCurrentEtco2(preTime, normalized);
    const preVal = getWaveform(0.45, normalized, preEtco2);
    if (Math.abs(preVal - normalized.rosc.lowEtco2) > 0.1) {
      errs.push({ path: "rosc.lowEtco2", code: "self_check_rosc_low_failed", message: "rendered plateau does not match lowEtco2" });
    }
    
    const postEtco2 = getCurrentEtco2(postTime, normalized);
    const postVal = getWaveform(0.45, normalized, postEtco2);
    if (Math.abs(postVal - normalized.rosc.highEtco2) > 0.1) {
      errs.push({ path: "rosc.highEtco2", code: "self_check_rosc_high_failed", message: "rendered plateau does not match highEtco2" });
    }
  } else {
    const testEtco2 = normalized.etco2;
    const testVal = getWaveform(0.45, normalized, testEtco2);
    if (Math.abs(testVal - testEtco2) > 0.1) {
      errs.push({ path: "etco2", code: "self_check_plateau_failed", message: "rendered plateau does not match etco2" });
    }
    
    if (normalized.pattern === 'flat' && testVal !== 0) {
      errs.push({ path: "pattern", code: "self_check_flat_failed", message: "flat trace must be zero" });
    }
  }
  
  if (normalized.pattern === 'rebreathing' && normalized.baselineEtco2) {
    const testVal = getWaveform(0.6, normalized, normalized.etco2);
    if (Math.abs(testVal - normalized.baselineEtco2) > 0.1) {
      errs.push({ path: "baselineEtco2", code: "self_check_baseline_failed", message: "rendered baseline does not match baselineEtco2" });
    }
  }
  
  return errs;
};

// Map 10 mmHg to 1 large box (30px). pxPerMmHg = 3.
export const pxPerMmHg = 3;

export const renderCapnographySvg = (input: CapnographySpec): string => {
  const spec = normalizeSpec(input);
  const leftPadding = 30; 
  const rightPadding = 18;
  const topPadding = 18;
  
  const maxEtco2 = spec.pattern === "rosc" && spec.rosc ? Math.max(spec.etco2, spec.rosc.highEtco2) : spec.etco2;
  const requiredBoxes = Math.max(5, Math.ceil((maxEtco2 + 5) / 10));
  const traceHeight = requiredBoxes * 30; 
  
  const width = leftPadding + secondsToPx(spec.durationSec) + rightPadding;
  const height = topPadding * 2 + traceHeight;
  const baselineY = topPadding + traceHeight;
  
  const sampleStepSec = 0.004;
  const points: string[] = [];
  
  const period = 60 / spec.respiratoryRate;
  
  for (let timeSec = 0; timeSec <= spec.durationSec + sampleStepSec / 2; timeSec += sampleStepSec) {
    const currentEtco2 = getCurrentEtco2(timeSec, spec);
    const u = (timeSec % period) / period;
    const val = getWaveform(u, spec, currentEtco2);
    
    const x = leftPadding + secondsToPx(timeSec);
    const y = baselineY - val * pxPerMmHg;
    points.push(`${fmt(x)},${fmt(y)}`);
  }
  
  const grid = renderGrid(width, height);
  const trace = `<polyline points="${points.join(" ")}" fill="none" stroke="#1f2933" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  
  const etco2LabelText = spec.pattern === "rosc" && spec.rosc ? `${spec.rosc.lowEtco2} → ${spec.rosc.highEtco2}` : `${spec.etco2}`;
  const label = `<text x="${fmt(width - rightPadding - 10)}" y="${fmt(topPadding + 20)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1f2933" text-anchor="end">EtCO2: ${etco2LabelText} mmHg</text>`;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" role="img" aria-label="Capnogram" data-kind="capnography" data-pattern="${spec.pattern}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(pxPerSec)}" data-px-per-mmhg="${fmt(pxPerMmHg)}" data-baseline-y="${fmt(baselineY)}">${grid}${trace}${label}</svg>`;

};

const fixtures: VisualKindModule<CapnographySpec>["fixtures"] = {
  valid: [
    { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16, durationSec: 15 },
    { kind: "capnography", pattern: "shark_fin", etco2: 45, respiratoryRate: 20, severity: 0.8 },
    { kind: "capnography", pattern: "flat", etco2: 0, respiratoryRate: 12 },
    { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 10, rosc: { lowEtco2: 12, highEtco2: 40, stepAtSec: 8 } },
    { kind: "capnography", pattern: "rebreathing", etco2: 45, respiratoryRate: 16, baselineEtco2: 15 },
  ],
  invalid: [
    { spec: { kind: "capnography", pattern: "nope", etco2: 40, respiratoryRate: 16 }, expectCode: "bad_pattern" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 999, respiratoryRate: 16 }, expectCode: "etco2_out_of_range" },
    { spec: { kind: "capnography", pattern: "flat", etco2: 10, respiratoryRate: 16 }, expectCode: "flat_nonzero_etco2" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40 }, expectCode: "rr_required" },
    { spec: { kind: "capnography", pattern: "shark_fin", etco2: 40, respiratoryRate: 16 }, expectCode: "severity_required" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16, severity: 0.5 }, expectCode: "severity_disallowed" },
    { spec: { kind: "capnography", pattern: "rebreathing", etco2: 40, respiratoryRate: 16, baselineEtco2: 50 }, expectCode: "baseline_out_of_range" },
    { spec: { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 16 }, expectCode: "rosc_required" },
    { spec: { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 16, rosc: { lowEtco2: 12 } }, expectCode: "rosc_high_required" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 999 }, expectCode: "rr_out_of_range" },
  ],
};

export const capnographyModule: VisualKindModule<CapnographySpec> = {
  kind: "capnography",
  validate: validateCapnography,
  selfCheck: selfCheckCapnography,
  renderSvg: renderCapnographySvg,
  fixtures,
};

import { registerVisual } from "../../registry";
registerVisual(capnographyModule as VisualKindModule);
