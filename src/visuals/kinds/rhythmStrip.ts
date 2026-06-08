import { mulberry32, type Rng } from "../primitives/prng";
import { fmt, mvToPx, pxPerMv, pxPerSec, renderGrid, secondsToPx } from "../primitives/graphPaper";
import { registerVisual, type VisualError, type VisualKindModule } from "../registry";

// ---------------------------------------------------------------------------
// Spec type (declared here so the union in ../types.ts is the only shared edit)
// ---------------------------------------------------------------------------

export type RhythmClass =
  | "sinus"
  | "sinus_brady"
  | "sinus_tach"
  | "afib"
  | "aflutter"
  | "svt"
  | "avb_1"
  | "avb_2_mobitz1"
  | "avb_2_mobitz2"
  | "avb_3"
  | "pvc"
  | "vtach"
  | "vfib"
  | "asystole";

export type RhythmStripVisual = {
  kind: "rhythm_strip";
  rhythm: RhythmClass;
  rateBpm: number;
  durationSec?: number;
  seed?: number;
  calibrationPulse?: boolean;
  atrialRateBpm?: number;
  conductionRatio?: number;
  prSec?: number;
  qrsSec?: number;
  qtSec?: number;
  caption?: {
    en: string;
    zh?: string;
  };
};

export const rhythmClasses = [
  "sinus",
  "sinus_brady",
  "sinus_tach",
  "afib",
  "aflutter",
  "svt",
  "avb_1",
  "avb_2_mobitz1",
  "avb_2_mobitz2",
  "avb_3",
  "pvc",
  "vtach",
  "vfib",
  "asystole",
] as const satisfies readonly RhythmClass[];

// ---------------------------------------------------------------------------
// Deterministic ECG renderer (relocated verbatim; math/scaling unchanged)
// ---------------------------------------------------------------------------

type NormalizedRhythmStripVisual = Required<
  Pick<RhythmStripVisual, "kind" | "rhythm" | "rateBpm" | "durationSec" | "seed" | "calibrationPulse">
> &
  Omit<RhythmStripVisual, "kind" | "rhythm" | "rateBpm" | "durationSec" | "seed" | "calibrationPulse">;

type Beat = {
  rSec: number;
  pSec?: number;
  tSec?: number;
  pAmpMv?: number;
  rAmpMv: number;
  qrsSec: number;
  wide?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalizeSpec = (spec: RhythmStripVisual): NormalizedRhythmStripVisual => ({
  ...spec,
  durationSec: spec.durationSec ?? 6,
  seed: spec.seed ?? 0,
  calibrationPulse: spec.calibrationPulse ?? true,
});

const rhythmDefaults = (rhythm: RhythmClass) => {
  if (rhythm === "avb_1") return { prSec: 0.24, qrsSec: 0.08, qtSec: 0.36 };
  if (rhythm === "vtach" || rhythm === "pvc") return { prSec: 0.16, qrsSec: 0.16, qtSec: 0.42 };
  if (rhythm === "avb_3") return { prSec: 0.16, qrsSec: 0.12, qtSec: 0.42 };
  return { prSec: 0.16, qrsSec: 0.08, qtSec: 0.36 };
};

const gaussian = (timeSec: number, centerSec: number, sigmaSec: number, ampMv: number) => {
  const z = (timeSec - centerSec) / sigmaSec;
  return ampMv * Math.exp(-0.5 * z * z);
};

const sawtooth = (phase: number) => 2 * (phase - Math.floor(phase + 0.5));

const buildRegularRPeaks = (rateBpm: number, durationSec: number, startSec = 0.8) => {
  if (rateBpm <= 0) return [];
  const rrSec = 60 / rateBpm;
  const peaks: number[] = [];
  for (let rSec = startSec; rSec < durationSec + 0.3; rSec += rrSec) peaks.push(rSec);
  return peaks;
};

const buildIrregularRPeaks = (rateBpm: number, durationSec: number, rng: Rng) => {
  const meanRrSec = 60 / Math.max(rateBpm, 20);
  const peaks: number[] = [];
  let rSec = 0.55 + rng() * 0.25;
  while (rSec < durationSec + 0.3) {
    peaks.push(rSec);
    const jitter = 0.62 + rng() * 0.78;
    rSec += clamp(meanRrSec * jitter, 0.28, 1.8);
  }
  return peaks;
};

const buildBeats = (spec: NormalizedRhythmStripVisual, rng: Rng) => {
  const defaults = rhythmDefaults(spec.rhythm);
  const prSec = spec.prSec ?? defaults.prSec;
  const qrsSec = spec.qrsSec ?? defaults.qrsSec;
  const qtSec = spec.qtSec ?? defaults.qtSec;
  const beats: Beat[] = [];

  // Synthetic morphology map for review:
  // sinus family/AVB1 = P before each narrow QRS; AF = irregular narrow QRS with fibrillatory baseline;
  // flutter = regular narrow QRS over sawtooth atrial activity; SVT = fast regular narrow QRS with hidden P;
  // Mobitz I/II = repeated P waves with dropped QRS patterns; AVB3 = independent P waves plus escape QRS;
  // PVC/VT = wide complexes; VF/asystole are baseline-only rhythms handled outside beat composition.
  const pushSinusBeat = (rSec: number, overrides: Partial<Beat> = {}) => {
    beats.push({
      rSec,
      pSec: rSec - prSec,
      tSec: rSec + qtSec * 0.58,
      pAmpMv: 0.16,
      rAmpMv: 1.0,
      qrsSec,
      ...overrides,
    });
  };

  if (spec.rhythm === "vfib" || spec.rhythm === "asystole") return beats;

  if (spec.rhythm === "afib") {
    buildIrregularRPeaks(spec.rateBpm, spec.durationSec, rng).forEach((rSec) =>
      beats.push({ rSec, tSec: rSec + qtSec * 0.55, rAmpMv: 0.9, qrsSec }),
    );
    return beats;
  }

  if (spec.rhythm === "aflutter" || spec.rhythm === "svt") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, spec.rhythm === "svt" ? 0.55 : 0.7).forEach((rSec) =>
      beats.push({ rSec, tSec: rSec + qtSec * 0.54, rAmpMv: spec.rhythm === "svt" ? 0.85 : 0.95, qrsSec }),
    );
    return beats;
  }

  if (spec.rhythm === "avb_2_mobitz1") {
    const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.33, 72);
    const ppSec = 60 / atrialRate;
    let pSec = 0.48;
    let groupIndex = 0;
    while (pSec < spec.durationSec) {
      if (groupIndex % 4 !== 3) {
        const progressivePr = [0.16, 0.22, 0.3][groupIndex % 4] ?? 0.2;
        pushSinusBeat(pSec + progressivePr, { pSec, qrsSec, rAmpMv: 0.95 });
      }
      pSec += ppSec;
      groupIndex += 1;
    }
    return beats;
  }

  if (spec.rhythm === "avb_2_mobitz2") {
    const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.5, 78);
    const ppSec = 60 / atrialRate;
    let pSec = 0.45;
    let index = 0;
    while (pSec < spec.durationSec) {
      if (index % 3 !== 2) pushSinusBeat(pSec + prSec, { pSec, qrsSec, rAmpMv: 0.95 });
      pSec += ppSec;
      index += 1;
    }
    return beats;
  }

  if (spec.rhythm === "avb_3") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.9).forEach((rSec) =>
      beats.push({ rSec, tSec: rSec + qtSec * 0.6, rAmpMv: 0.85, qrsSec: spec.qrsSec ?? 0.12, wide: true }),
    );
    return beats;
  }

  if (spec.rhythm === "pvc") {
    const ectopicSec = spec.durationSec / 2;
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.75).forEach((rSec) => {
      if (Math.abs(rSec - ectopicSec) > 0.55) pushSinusBeat(rSec);
    });
    beats.push({ rSec: ectopicSec, tSec: ectopicSec + 0.34, rAmpMv: 1.35, qrsSec: spec.qrsSec ?? 0.16, wide: true });
    return beats.sort((left, right) => left.rSec - right.rSec);
  }

  if (spec.rhythm === "vtach") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.35).forEach((rSec) =>
      beats.push({ rSec, tSec: rSec + 0.2, rAmpMv: 1.25, qrsSec: spec.qrsSec ?? 0.16, wide: true }),
    );
    return beats;
  }

  buildRegularRPeaks(spec.rateBpm, spec.durationSec).forEach((rSec) => pushSinusBeat(rSec));
  return beats;
};

const atrialPWaveMv = (timeSec: number, spec: NormalizedRhythmStripVisual) => {
  if (spec.rhythm !== "avb_3") return 0;
  const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.8, 78);
  const ppSec = 60 / atrialRate;
  let value = 0;
  for (let pSec = 0.28; pSec < spec.durationSec + ppSec; pSec += ppSec) {
    value += gaussian(timeSec, pSec, 0.04, 0.14);
  }
  return value;
};

const rhythmBaselineMv = (timeSec: number, spec: NormalizedRhythmStripVisual, rngValues: readonly number[]) => {
  if (spec.rhythm === "asystole") {
    return 0.012 * Math.sin(timeSec * 2 * Math.PI * 0.7);
  }
  if (spec.rhythm === "vfib") {
    const f1 = 4.5 + rngValues[0] * 2.5;
    const f2 = 8 + rngValues[1] * 5;
    const f3 = 13 + rngValues[2] * 4;
    return (
      0.36 * Math.sin(timeSec * 2 * Math.PI * f1) +
      0.22 * Math.sin(timeSec * 2 * Math.PI * f2 + 1.7) +
      0.13 * Math.sin(timeSec * 2 * Math.PI * f3 + 0.4)
    );
  }
  if (spec.rhythm === "afib") {
    return 0.045 * Math.sin(timeSec * 2 * Math.PI * 7.5) + 0.025 * Math.sin(timeSec * 2 * Math.PI * 11.7 + 0.8);
  }
  if (spec.rhythm === "aflutter") {
    const atrialRate = spec.atrialRateBpm ?? spec.rateBpm * (spec.conductionRatio ?? 4);
    const phase = (timeSec * atrialRate) / 60;
    return -0.16 * sawtooth(phase);
  }
  return 0;
};

const beatMvAt = (timeSec: number, beat: Beat) => {
  let value = 0;
  if (beat.pSec !== undefined) value += gaussian(timeSec, beat.pSec, 0.045, beat.pAmpMv ?? 0.14);
  const qrsSigma = beat.qrsSec / (beat.wide ? 4.8 : 7.5);
  value += gaussian(timeSec, beat.rSec - beat.qrsSec * 0.22, qrsSigma, beat.wide ? -0.35 : -0.18);
  value += gaussian(timeSec, beat.rSec, qrsSigma * 0.7, beat.rAmpMv);
  value += gaussian(timeSec, beat.rSec + beat.qrsSec * 0.24, qrsSigma, beat.wide ? -0.65 : -0.28);
  if (beat.tSec !== undefined) value += gaussian(timeSec, beat.tSec, beat.wide ? 0.11 : 0.13, beat.wide ? -0.18 : 0.28);
  return value;
};

const renderCalibrationPulse = (x: number, baselineY: number) => {
  const topY = baselineY - mvToPx(1);
  const width = secondsToPx(0.2);
  const foot = secondsToPx(0.04);
  return `<path d="M ${fmt(x)} ${fmt(baselineY)} h ${fmt(foot)} v ${fmt(-mvToPx(1))} h ${fmt(width)} v ${fmt(mvToPx(1))} h ${fmt(foot)}" fill="none" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-calibration-mv="1" data-calibration-sec="0.2" data-calibration-top-y="${fmt(topY)}"/>`;
};

export const renderRhythmStripSvg = (input: RhythmStripVisual): string => {
  const spec = normalizeSpec(input);
  const rng = mulberry32(spec.seed);
  const rngValues = [rng(), rng(), rng(), rng()];
  const leftPadding = spec.calibrationPulse ? 72 : 18;
  const rightPadding = 18;
  const topPadding = 18;
  const traceHeight = 150;
  const width = leftPadding + secondsToPx(spec.durationSec) + rightPadding;
  const height = topPadding * 2 + traceHeight;
  const baselineY = topPadding + traceHeight / 2;
  const beats = buildBeats(spec, rng);
  const sampleStepSec = 0.004;
  const points: string[] = [];

  for (let timeSec = 0; timeSec <= spec.durationSec + sampleStepSec / 2; timeSec += sampleStepSec) {
    let mv = rhythmBaselineMv(timeSec, spec, rngValues) + atrialPWaveMv(timeSec, spec);
    beats.forEach((beat) => {
      mv += beatMvAt(timeSec, beat);
    });
    const x = leftPadding + secondsToPx(timeSec);
    const y = baselineY - mvToPx(clamp(mv, -1.4, 1.7));
    points.push(`${fmt(x)},${fmt(y)}`);
  }

  const grid = renderGrid(width, height);
  const calibration = spec.calibrationPulse ? renderCalibrationPulse(18, baselineY) : "";
  const trace = `<polyline points="${points.join(" ")}" fill="none" stroke="#1f2933" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" role="img" aria-label="ECG rhythm strip" data-kind="rhythm_strip" data-rhythm="${spec.rhythm}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(pxPerSec)}" data-px-per-mv="${fmt(pxPerMv)}">${grid}${calibration}${trace}</svg>`;
};

// ---------------------------------------------------------------------------
// Validation (reproduces the schema doc's rhythm-strip rules verbatim)
// ---------------------------------------------------------------------------

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
  options: { integer?: boolean } = {},
) => {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errs.push({ path, code: `${code}_not_number`, message: "must be a number" });
    return;
  }
  if (options.integer && !Number.isInteger(value)) errs.push({ path, code: `${code}_not_integer`, message: "must be an integer" });
  if (value < min || value > max) errs.push({ path, code, message: `must be between ${min} and ${max}` });
};

const validateRhythmStrip = (spec: RhythmStripVisual): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as Record<string, unknown>;

  if (!rhythmClasses.includes(value.rhythm as RhythmClass)) {
    errs.push({ path: "rhythm", code: "bad_rhythm_class", message: "is invalid" });
  }

  const rhythm = value.rhythm as RhythmClass | undefined;
  const minRate = rhythm === "vfib" || rhythm === "asystole" ? 0 : 20;
  bounded(value.rateBpm, "rateBpm", minRate, 300, "rate_out_of_range", errs);
  if (value.rateBpm === undefined) errs.push({ path: "rateBpm", code: "rate_required", message: "is required" });
  bounded(value.durationSec, "durationSec", 3, 12, "duration_out_of_range", errs);
  bounded(value.seed, "seed", 0, Number.MAX_SAFE_INTEGER, "seed_out_of_range", errs, { integer: true });
  bounded(value.atrialRateBpm, "atrialRateBpm", 20, 400, "atrial_rate_out_of_range", errs);
  bounded(value.conductionRatio, "conductionRatio", 1, 8, "conduction_ratio_out_of_range", errs, { integer: true });
  bounded(value.prSec, "prSec", 0.06, 0.4, "pr_out_of_range", errs);
  bounded(value.qrsSec, "qrsSec", 0.04, 0.24, "qrs_out_of_range", errs);
  bounded(value.qtSec, "qtSec", 0.16, 0.7, "qt_out_of_range", errs);

  if (value.calibrationPulse !== undefined && typeof value.calibrationPulse !== "boolean") {
    errs.push({ path: "calibrationPulse", code: "calibration_not_boolean", message: "must be a boolean" });
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

// ---------------------------------------------------------------------------
// Fixtures (the conformance harness runs these automatically)
// ---------------------------------------------------------------------------

const fixtures: VisualKindModule<RhythmStripVisual>["fixtures"] = {
  valid: [
    { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, durationSec: 6, seed: 42, prSec: 0.16, qrsSec: 0.08, qtSec: 0.36 },
    { kind: "rhythm_strip", rhythm: "afib", rateBpm: 134, seed: 33, qrsSec: 0.08, caption: { en: "Lead II rhythm strip" } },
    { kind: "rhythm_strip", rhythm: "vfib", rateBpm: 0, seed: 5 },
    { kind: "rhythm_strip", rhythm: "asystole", rateBpm: 0 },
    { kind: "rhythm_strip", rhythm: "aflutter", rateBpm: 75, atrialRateBpm: 300, conductionRatio: 4, caption: { en: "On admission", zh: "入院时" } },
  ],
  invalid: [
    { spec: { kind: "rhythm_strip", rhythm: "nope", rateBpm: 75 }, expectCode: "bad_rhythm_class" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 9999 }, expectCode: "rate_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus" }, expectCode: "rate_required" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, durationSec: 99 }, expectCode: "duration_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, seed: 1.5 }, expectCode: "seed_out_of_range_not_integer" },
    { spec: { kind: "rhythm_strip", rhythm: "aflutter", rateBpm: 75, conductionRatio: 0 }, expectCode: "conduction_ratio_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, prSec: 9 }, expectCode: "pr_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, calibrationPulse: "yes" }, expectCode: "calibration_not_boolean" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, caption: { en: "ok", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const rhythmStripModule: VisualKindModule<RhythmStripVisual> = {
  kind: "rhythm_strip",
  validate: validateRhythmStrip,
  renderSvg: renderRhythmStripSvg,
  fixtures,
};

// `allowedItemTypes` / `requiredSchemaVersion` omitted → registry defaults
// (multiple_choice, select_all, matrix; schema "1.2"), matching current behavior.
registerVisual(rhythmStripModule as VisualKindModule);
