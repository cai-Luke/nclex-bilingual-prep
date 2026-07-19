import { escapeXml } from "./escapeXml";
import { fmt, fmtNum, roundTo } from "./graphPaper";

export interface DivergingBarBin {
  label: string;
  positive: number;
  negative: number;
}

export interface OverlayLinePoint {
  binIndex: number;
  value: number;
}

export interface DivergingBarsInput {
  bins: DivergingBarBin[];
  positiveLabel: string;
  negativeLabel: string;
  yAxisLabel: string;
  overlay?: { label: string; points: OverlayLinePoint[]; axisLabel: string };
  width?: number;
  height?: number;
}

const signedTick = (value: number): string =>
  value < 0 ? `−${fmtNum(Math.abs(value))}` : fmtNum(value);

const niceCeil = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const normalized = value / base;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return roundTo(factor * base, 6);
};

export function renderDivergingBars(input: DivergingBarsInput): string {
  const width = input.width ?? 600;
  const height = input.height ?? 260;
  const marginTop = 34;
  const hasOverlay = input.overlay !== undefined && input.overlay.points.length > 0;
  const marginRight = hasOverlay ? 62 : 24;
  const marginBottom = 48;
  const marginLeft = 62;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const baselineY = marginTop + plotHeight / 2;
  const maxBarAbs = Math.max(
    0,
    ...input.bins.flatMap((bin) => [Math.abs(bin.positive), Math.abs(bin.negative)]),
  );
  const axisMax = niceCeil(maxBarAbs);
  const axisMin = -axisMax;
  const yScale = plotHeight / (axisMax - axisMin);
  const maxOverlayAbs = Math.max(
    0,
    ...(input.overlay?.points.map((point) => Math.abs(point.value)) ?? []),
  );
  const overlayAxisMax = niceCeil(maxOverlayAbs);
  const overlayAxisMin = -overlayAxisMax;
  const overlayYScale = plotHeight / (overlayAxisMax - overlayAxisMin);
  const band = input.bins.length > 0 ? plotWidth / input.bins.length : plotWidth;
  const barWidth = Math.max(10, Math.min(36, band * 0.34));
  const elements: string[] = [];

  const yFor = (value: number): number => baselineY - value * yScale;
  const overlayYFor = (value: number): number => baselineY - value * overlayYScale;
  const xForBin = (index: number): number => marginLeft + band * index + band / 2;

  elements.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(height)}" fill="#ffffff"/>`);

  for (const tick of [axisMin, axisMin / 2, 0, axisMax / 2, axisMax]) {
    const y = yFor(tick);
    elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(y)}" x2="${fmt(width - marginRight)}" y2="${fmt(y)}" stroke="${tick === 0 ? "#94a3b8" : "#e2e8f0"}" stroke-width="${tick === 0 ? "1.5" : "1"}"/>`);
    elements.push(`<text x="${fmt(marginLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">${escapeXml(signedTick(tick))}</text>`);
  }

  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop)}" x2="${fmt(marginLeft)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop + plotHeight)}" x2="${fmt(width - marginRight)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
  elements.push(`<text x="${fmt(marginLeft - 42)}" y="${fmt(marginTop - 12)}" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155" text-anchor="start">${escapeXml(input.yAxisLabel)}</text>`);

  if (hasOverlay) {
    const rightAxisX = width - marginRight;
    elements.push(`<line x1="${fmt(rightAxisX)}" y1="${fmt(marginTop)}" x2="${fmt(rightAxisX)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
    for (const tick of [overlayAxisMin, overlayAxisMin / 2, 0, overlayAxisMax / 2, overlayAxisMax]) {
      const y = overlayYFor(tick);
      elements.push(`<text x="${fmt(rightAxisX + 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="start">${escapeXml(signedTick(tick))}</text>`);
    }
  }

  input.bins.forEach((bin, index) => {
    const x = xForBin(index);
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(marginTop)}" x2="${fmt(x)}" y2="${fmt(marginTop + plotHeight)}" stroke="#f1f5f9" stroke-width="1"/>`);

    if (bin.positive > 0) {
      const barHeight = bin.positive * yScale;
      elements.push(`<rect data-role="positive-bar" x="${fmt(x - barWidth / 2)}" y="${fmt(baselineY - barHeight)}" width="${fmt(barWidth)}" height="${fmt(barHeight)}" fill="#2563eb" opacity="0.82" rx="2"/>`);
    }
    if (bin.negative > 0) {
      const barHeight = bin.negative * yScale;
      elements.push(`<rect data-role="negative-bar" x="${fmt(x - barWidth / 2)}" y="${fmt(baselineY)}" width="${fmt(barWidth)}" height="${fmt(barHeight)}" fill="#64748b" opacity="0.86" rx="2"/>`);
    }

    elements.push(`<text x="${fmt(x)}" y="${fmt(height - 18)}" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">${escapeXml(bin.label)}</text>`);
  });

  if (hasOverlay && input.overlay !== undefined) {
    const points = input.overlay.points
      .filter((point) => point.binIndex >= 0 && point.binIndex < input.bins.length)
      .map((point) => `${fmt(xForBin(point.binIndex))},${fmt(overlayYFor(point.value))}`)
      .join(" ");
    if (points.length > 0) {
      elements.push(`<polyline data-role="overlay-line" points="${points}" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
      input.overlay.points
        .filter((point) => point.binIndex >= 0 && point.binIndex < input.bins.length)
        .forEach((point) => {
          elements.push(`<circle data-role="overlay-point" cx="${fmt(xForBin(point.binIndex))}" cy="${fmt(overlayYFor(point.value))}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>`);
        });
    }
  }

  let legendX = marginLeft;
  const legendY = 16;
  const legendItems = [
    { label: input.positiveLabel, color: "#2563eb", shape: "rect" },
    { label: input.negativeLabel, color: "#64748b", shape: "rect" },
    ...(hasOverlay && input.overlay !== undefined ? [{ label: input.overlay.label, color: "#0f172a", shape: "line" }] : []),
  ];
  legendItems.forEach((item) => {
    if (item.shape === "line") {
      elements.push(`<line x1="${fmt(legendX)}" y1="${fmt(legendY - 4)}" x2="${fmt(legendX + 18)}" y2="${fmt(legendY - 4)}" stroke="${item.color}" stroke-width="2.2"/>`);
    } else {
      elements.push(`<rect x="${fmt(legendX)}" y="${fmt(legendY - 11)}" width="14" height="8" fill="${item.color}" rx="1"/>`);
    }
    elements.push(`<text x="${fmt(legendX + 24)}" y="${fmt(legendY)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(item.label)}</text>`);
    legendX += Math.max(92, item.label.length * 7 + 42);
  });

  if (hasOverlay && input.overlay !== undefined) {
    elements.push(`<text x="${fmt(width - marginRight + 42)}" y="${fmt(marginTop - 12)}" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155" text-anchor="end">${escapeXml(input.overlay.axisLabel)}</text>`);
  }

  return `<g class="diverging-bars" data-axis-min="${fmt(axisMin)}" data-axis-max="${fmt(axisMax)}" data-zero-y="${fmt(baselineY)}"${hasOverlay ? ` data-overlay-axis-min="${fmt(overlayAxisMin)}" data-overlay-axis-max="${fmt(overlayAxisMax)}" data-overlay-zero-y="${fmt(baselineY)}"` : ""}>\n${elements.join("\n")}\n</g>`;
}
