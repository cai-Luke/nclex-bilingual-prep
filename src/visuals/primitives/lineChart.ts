import { fmt } from "./graphPaper";
import { escapeXml } from "./escapeXml";

export interface ChartSeries {
  label: string;            // "HR", "SBP", …
  unit: string;             // "bpm", "mmHg", …
  points: { x: number; y: number }[];   // x in axis units (e.g., hours), y in data units
  axis?: "left" | "right";  // dual y-axis support
  /** optional shaded normal band for THIS series, in y-units */
  referenceBand?: { low: number; high: number };
  styleRole?: string;       // maps to a theme color (e.g., 'primary', 'secondary')
}

export interface LineChartInput {
  series: ChartSeries[];
  xAxis: { label: string; min: number; max: number; ticks?: number[] };
  yAxisLeft: { label: string; min: number; max: number; ticks?: number[] };
  yAxisRight?: { label: string; min: number; max: number; ticks?: number[] };
  width?: number;
  height?: number;
}

const colorForRole = (role?: string) => {
  switch (role) {
    case "red": return "#ef4444"; // red-500
    case "blue": return "#3b82f6"; // blue-500
    case "green": return "#10b981"; // emerald-500
    case "orange": return "#f97316"; // orange-500
    case "purple": return "#8b5cf6"; // violet-500
    case "slate": return "#64748b"; // slate-500
    case "primary": return "#1f2933"; // text color
    case "band": return "#f1f5f9"; // slate-100 for bands
    default: return "#1f2933";
  }
};

export function renderLineChart(input: LineChartInput): string {
  const width = input.width ?? 600;
  const height = input.height ?? 300;
  
  const marginTop = 30;
  const marginBottom = 50;
  const marginLeft = 60;
  const marginRight = input.yAxisRight ? 60 : 30;
  
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  
  const mapX = (x: number) => {
    const range = input.xAxis.max - input.xAxis.min;
    if (range <= 0) return marginLeft + plotWidth / 2;
    return marginLeft + ((x - input.xAxis.min) / range) * plotWidth;
  };
  
  const mapYLeft = (y: number) => {
    const range = input.yAxisLeft.max - input.yAxisLeft.min;
    if (range <= 0) return marginTop + plotHeight / 2;
    return marginTop + plotHeight - ((y - input.yAxisLeft.min) / range) * plotHeight;
  };
  
  const mapYRight = (y: number) => {
    if (!input.yAxisRight) return marginTop + plotHeight / 2;
    const range = input.yAxisRight.max - input.yAxisRight.min;
    if (range <= 0) return marginTop + plotHeight / 2;
    return marginTop + plotHeight - ((y - input.yAxisRight.min) / range) * plotHeight;
  };
  
  const mapY = (y: number, axis?: "left" | "right") => axis === "right" ? mapYRight(y) : mapYLeft(y);
  
  let elements: string[] = [];
  
  // 1. Draw Reference Bands
  input.series.forEach(s => {
    if (s.referenceBand) {
      const y1 = mapY(s.referenceBand.high, s.axis);
      const y2 = mapY(s.referenceBand.low, s.axis);
      const bandHeight = Math.max(0, y2 - y1);
      
      if (bandHeight > 0) {
        elements.push(`<rect x="${fmt(marginLeft)}" y="${fmt(y1)}" width="${fmt(plotWidth)}" height="${fmt(bandHeight)}" fill="${colorForRole("band")}" opacity="0.6"/>`);
      }
    }
  });

  // 2. Draw Grid and Axes
  // Left Y-axis ticks
  const leftTicks = input.yAxisLeft.ticks ?? [input.yAxisLeft.min, input.yAxisLeft.max];
  leftTicks.forEach(tick => {
    const y = mapYLeft(tick);
    elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(y)}" x2="${fmt(width - marginRight)}" y2="${fmt(y)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(marginLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="end">${fmt(tick)}</text>`);
  });
  
  // Right Y-axis ticks
  if (input.yAxisRight) {
    const rightTicks = input.yAxisRight.ticks ?? [input.yAxisRight.min, input.yAxisRight.max];
    rightTicks.forEach(tick => {
      const y = mapYRight(tick);
      elements.push(`<text x="${fmt(width - marginRight + 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="start">${fmt(tick)}</text>`);
    });
  }
  
  // X-axis ticks
  const xTicks = input.xAxis.ticks ?? [input.xAxis.min, input.xAxis.max];
  xTicks.forEach(tick => {
    const x = mapX(tick);
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(marginTop)}" x2="${fmt(x)}" y2="${fmt(height - marginBottom)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(x)}" y="${fmt(height - marginBottom + 16)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${escapeXml(fmt(tick))}</text>`);
  });
  
  // Axis lines
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop)}" x2="${fmt(marginLeft)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`); // Left axis
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(height - marginBottom)}" x2="${fmt(width - marginRight)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`); // Bottom axis
  
  if (input.yAxisRight) {
    elements.push(`<line x1="${fmt(width - marginRight)}" y1="${fmt(marginTop)}" x2="${fmt(width - marginRight)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`); // Right axis
  }
  
  // Labels
  elements.push(`<text x="${fmt(marginLeft + plotWidth / 2)}" y="${fmt(height - marginBottom + 36)}" font-family="sans-serif" font-size="14" font-weight="500" fill="#334155" text-anchor="middle">${escapeXml(input.xAxis.label)}</text>`);
  elements.push(`<text x="${fmt(marginLeft - 40)}" y="${fmt(marginTop - 10)}" font-family="sans-serif" font-size="12" font-weight="500" fill="#334155" text-anchor="start">${escapeXml(input.yAxisLeft.label)}</text>`);
  
  if (input.yAxisRight) {
    elements.push(`<text x="${fmt(width - marginRight + 40)}" y="${fmt(marginTop - 10)}" font-family="sans-serif" font-size="12" font-weight="500" fill="#334155" text-anchor="end">${escapeXml(input.yAxisRight.label)}</text>`);
  }

  // 3. Draw Series Polylines and Points
  input.series.forEach(s => {
    if (s.points.length === 0) return;
    
    const color = colorForRole(s.styleRole);
    
    const svgPts = s.points.map(p => `${fmt(mapX(p.x))},${fmt(mapY(p.y, s.axis))}`).join(" ");
    elements.push(`<polyline points="${svgPts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
    
    s.points.forEach(p => {
      elements.push(`<circle cx="${fmt(mapX(p.x))}" cy="${fmt(mapY(p.y, s.axis))}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2"/>`);
    });
  });
  
  // 4. Draw Legend
  let legendX = marginLeft;
  const legendY = 15;
  input.series.forEach(s => {
    const color = colorForRole(s.styleRole);
    elements.push(`<line x1="${fmt(legendX)}" y1="${fmt(legendY - 4)}" x2="${fmt(legendX + 16)}" y2="${fmt(legendY - 4)}" stroke="${color}" stroke-width="2"/>`);
    elements.push(`<circle cx="${fmt(legendX + 8)}" cy="${fmt(legendY - 4)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`);
    elements.push(`<text x="${fmt(legendX + 22)}" y="${fmt(legendY)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(s.label)} (${escapeXml(s.unit)})</text>`);
    legendX += 100; // rough spacing
  });
  
  return `<g class="line-chart">${elements.join("\n")}</g>`;
}
