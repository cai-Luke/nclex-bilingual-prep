import { fmt, pxPerSec as ecgPxPerSec, secondsToPx } from "../../primitives/graphPaper";
import { mulberry32 } from "../../primitives/prng";
import { featureOffsetAt } from "./features";
import type {
  FetalMonitoringSpec,
  FhrAcceleration,
  FhrDeceleration,
  FhrVariability,
  UterineContraction,
} from "./types";

export const CTG_PX_PER_SEC = 1.2;
export const SAMPLE_STEP_SEC = 0.5;
export const DEFAULT_DURATION_SEC = 600;
export const DEFAULT_CONTRACTION_AMPLITUDE_MMHG = 50;
export const DEFAULT_CONTRACTION_DURATION_SEC = 60;
export const UA_RESTING_TONE_MMHG = 10;

export const FHR_MIN_BPM = 50;
export const FHR_MAX_BPM = 220;
export const UA_MIN_MMHG = 0;
export const UA_MAX_MMHG = 100;

const LABEL_GUTTER = 82;
const RIGHT_PADDING = 18;
const TOP_PADDING = 18;
const BOTTOM_PADDING = 28;
const PANEL_GAP = 24;
const FHR_PANEL_HEIGHT = 238;
const UA_PANEL_HEIGHT = 150;

export const VARIABILITY_PEAK_TO_TROUGH_BPM: Record<FhrVariability, number> = {
  absent: 0,
  minimal: 4,
  moderate: 14,
  marked: 32,
};

export interface NormalizedFetalMonitoringSpec extends FetalMonitoringSpec {
  durationSec: number;
  seed: number;
  contractions: UterineContraction[];
  accelerations: FhrAcceleration[];
  decelerations: FhrDeceleration[];
}

export interface ChannelLayout {
  width: number;
  height: number;
  plotLeft: number;
  plotWidth: number;
  fhrTop: number;
  fhrHeight: number;
  uaTop: number;
  uaHeight: number;
}

export const normalizeFetalMonitoringSpec = (
  spec: FetalMonitoringSpec,
): NormalizedFetalMonitoringSpec => ({
  ...spec,
  durationSec: spec.durationSec ?? DEFAULT_DURATION_SEC,
  seed: spec.seed ?? 0,
  contractions: Array.isArray(spec.contractions) ? spec.contractions : [],
  accelerations: Array.isArray(spec.accelerations) ? spec.accelerations : [],
  decelerations: Array.isArray(spec.decelerations) ? spec.decelerations : [],
});

// Reuse the shared seconds conversion while applying this kind's schematic
// scale rather than ECG paper speed.
export const ctgSecondsToPx = (seconds: number) =>
  (secondsToPx(seconds) / ecgPxPerSec) * CTG_PX_PER_SEC;

export const createChannelLayout = (durationSec: number): ChannelLayout => {
  const plotWidth = ctgSecondsToPx(durationSec);
  const fhrTop = TOP_PADDING;
  const uaTop = fhrTop + FHR_PANEL_HEIGHT + PANEL_GAP;
  return {
    width: LABEL_GUTTER + plotWidth + RIGHT_PADDING,
    height: uaTop + UA_PANEL_HEIGHT + BOTTOM_PADDING,
    plotLeft: LABEL_GUTTER,
    plotWidth,
    fhrTop,
    fhrHeight: FHR_PANEL_HEIGHT,
    uaTop,
    uaHeight: UA_PANEL_HEIGHT,
  };
};

export const timeToX = (timeSec: number, layout: ChannelLayout) =>
  layout.plotLeft + ctgSecondsToPx(timeSec);

export const fhrToY = (fhr: number, layout: ChannelLayout) =>
  layout.fhrTop +
  ((FHR_MAX_BPM - fhr) / (FHR_MAX_BPM - FHR_MIN_BPM)) * layout.fhrHeight;

export const uaToY = (ua: number, layout: ChannelLayout) =>
  layout.uaTop +
  ((UA_MAX_MMHG - ua) / (UA_MAX_MMHG - UA_MIN_MMHG)) * layout.uaHeight;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const buildVariabilitySeries = (
  durationSec: number,
  variability: FhrVariability,
  seed: number,
): number[] => {
  const sampleCount = Math.round(durationSec / SAMPLE_STEP_SEC) + 1;
  const targetRange = VARIABILITY_PEAK_TO_TROUGH_BPM[variability];
  if (targetRange === 0) return Array.from({ length: sampleCount }, () => 0);

  const rng = mulberry32(seed);
  const raw = Array.from({ length: sampleCount }, (_, index) => {
    const fast = rng() * 2 - 1;
    const slow = Math.sin(index * 0.41 + rng() * 0.3);
    return fast * 0.72 + slow * 0.28;
  });
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const midpoint = (max + min) / 2;
  const scale = targetRange / (max - min);
  return raw.map((value) => (value - midpoint) * scale);
};

export const uterineActivityAt = (
  timeSec: number,
  contractions: readonly UterineContraction[],
): number => {
  const activity = contractions.reduce((sum, contraction) => {
    const amplitude = contraction.amplitudeMmHg ?? DEFAULT_CONTRACTION_AMPLITUDE_MMHG;
    const duration = contraction.durationSec ?? DEFAULT_CONTRACTION_DURATION_SEC;
    const sigma = duration / 6;
    const z = (timeSec - contraction.peakSec) / sigma;
    return sum + amplitude * Math.exp(-0.5 * z * z);
  }, UA_RESTING_TONE_MMHG);
  return clamp(activity, UA_MIN_MMHG, UA_MAX_MMHG);
};

export const fetalHeartRateAt = (
  timeSec: number,
  baselineFhr: number,
  variabilityOffset: number,
  accelerations: readonly FhrAcceleration[],
  decelerations: readonly FhrDeceleration[],
) =>
  clamp(
    baselineFhr +
      variabilityOffset +
      featureOffsetAt(timeSec, accelerations, decelerations),
    FHR_MIN_BPM,
    FHR_MAX_BPM,
  );

const renderPanelGrid = (
  layout: ChannelLayout,
  top: number,
  height: number,
  horizontalValues: readonly number[],
  valueToY: (value: number, layout: ChannelLayout) => number,
) => {
  const lines: string[] = [
    `<rect x="${fmt(layout.plotLeft)}" y="${fmt(top)}" width="${fmt(layout.plotWidth)}" height="${fmt(height)}" fill="#fffdfd" stroke="#d48c99" stroke-width="1"/>`,
  ];

  for (let sec = 0; sec <= layout.plotWidth / CTG_PX_PER_SEC; sec += 10) {
    const x = timeToX(sec, layout);
    const major = sec % 60 === 0;
    lines.push(
      `<line x1="${fmt(x)}" y1="${fmt(top)}" x2="${fmt(x)}" y2="${fmt(top + height)}" stroke="${major ? "#e9a0ad" : "#f5c8d0"}" stroke-width="${major ? "1" : "0.5"}"/>`,
    );
  }

  horizontalValues.forEach((value) => {
    const y = valueToY(value, layout);
    lines.push(
      `<line x1="${fmt(layout.plotLeft)}" y1="${fmt(y)}" x2="${fmt(layout.plotLeft + layout.plotWidth)}" y2="${fmt(y)}" stroke="#e9a0ad" stroke-width="0.8"/>`,
    );
  });
  return lines.join("");
};

const renderAxisLabels = (
  layout: ChannelLayout,
  values: readonly number[],
  valueToY: (value: number, layout: ChannelLayout) => number,
) =>
  values
    .map(
      (value) =>
        `<text x="${fmt(layout.plotLeft - 8)}" y="${fmt(valueToY(value, layout) + 4)}" text-anchor="end" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">${value}</text>`,
    )
    .join("");

export const renderChannels = (input: FetalMonitoringSpec): string => {
  const spec = normalizeFetalMonitoringSpec(input);
  const layout = createChannelLayout(spec.durationSec);
  const variability = buildVariabilitySeries(spec.durationSec, spec.variability, spec.seed);
  const fhrPoints: string[] = [];
  const uaPoints: string[] = [];

  for (let index = 0; index < variability.length; index += 1) {
    const timeSec = Math.min(index * SAMPLE_STEP_SEC, spec.durationSec);
    const fhr = fetalHeartRateAt(
      timeSec,
      spec.baselineFhr,
      variability[index],
      spec.accelerations,
      spec.decelerations,
    );
    const ua = uterineActivityAt(timeSec, spec.contractions);
    const x = timeToX(timeSec, layout);
    fhrPoints.push(`${fmt(x)},${fmt(fhrToY(fhr, layout))}`);
    uaPoints.push(`${fmt(x)},${fmt(uaToY(ua, layout))}`);
  }

  const fhrValues = [60, 90, 120, 150, 180, 210];
  const uaValues = [0, 20, 40, 60, 80, 100];
  const timeLabels: string[] = [];
  for (let sec = 0; sec <= spec.durationSec; sec += 60) {
    timeLabels.push(
      `<text x="${fmt(timeToX(sec, layout))}" y="${fmt(layout.uaTop + layout.uaHeight + 18)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">${sec / 60}</text>`,
    );
  }

  const contractionMarkers = spec.contractions
    .map(
      (contraction, index) =>
        `<circle data-contraction-index="${index}" data-peak-sec="${fmt(contraction.peakSec)}" cx="${fmt(timeToX(contraction.peakSec, layout))}" cy="${fmt(uaToY(uterineActivityAt(contraction.peakSec, [contraction]), layout))}" r="0" fill="none"/>`,
    )
    .join("");

  return `<rect x="0" y="0" width="${fmt(layout.width)}" height="${fmt(layout.height)}" fill="#ffffff"/>
<g id="fhr-panel" data-panel="fhr">
${renderPanelGrid(layout, layout.fhrTop, layout.fhrHeight, fhrValues, fhrToY)}
${renderAxisLabels(layout, fhrValues, fhrToY)}
<text x="18" y="${fmt(layout.fhrTop + layout.fhrHeight / 2)}" transform="rotate(-90 18 ${fmt(layout.fhrTop + layout.fhrHeight / 2)})" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">FHR (bpm)</text>
<polyline data-channel="fhr" points="${fhrPoints.join(" ")}" fill="none" stroke="#1f2933" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g id="ua-panel" data-panel="ua">
${renderPanelGrid(layout, layout.uaTop, layout.uaHeight, uaValues, uaToY)}
${renderAxisLabels(layout, uaValues, uaToY)}
<text x="18" y="${fmt(layout.uaTop + layout.uaHeight / 2)}" transform="rotate(-90 18 ${fmt(layout.uaTop + layout.uaHeight / 2)})" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">UA (mmHg)</text>
<polyline data-channel="ua" points="${uaPoints.join(" ")}" fill="none" stroke="#1f2933" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
${contractionMarkers}
${timeLabels.join("")}
<text x="${fmt(layout.plotLeft + layout.plotWidth / 2)}" y="${fmt(layout.height - 4)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">Time (min)</text>
</g>`;
};
