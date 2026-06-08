// Per-pattern morphology + scaling fixtures for the capnography renderer.
// §6/§7 of U1-CAPNOGRAPHY-SPEC.md: the generic conformance harness covers
// validate/determinism/selfCheck, but the *shape* that keys answers must be
// locked here so a future refactor can't silently flatten shark_fin or zero out
// a baseline without a test going red. Morphology is asserted against the shape
// source of truth (getWaveform); scaling/wiring is asserted against the rendered
// SVG so the render path can't drift from the waveform.
import { createHash } from "node:crypto";
import { pxPerSec } from "../../src/visuals/primitives/graphPaper";
import {
  getCurrentEtco2,
  getWaveform,
  normalizeSpec,
  pxPerMmHg,
  renderCapnographySvg,
} from "../../src/visuals/kinds/capnography";
import type { CapnographySpec } from "../../src/visuals/kinds/capnography/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// Sample the waveform shape at normalized cycle time u, with an optional etco2
// override (rosc swaps amplitude part-way through the strip).
const sampleU = (spec: CapnographySpec, u: number, etco2?: number) => {
  const norm = normalizeSpec(spec);
  return getWaveform(u, norm, etco2 ?? norm.etco2);
};

// Reconstruct the rendered series in mmHg from the SVG polyline, using the
// self-describing scale attributes. Returns [timeSec, mmHg] pairs.
const renderedSeries = (svg: string): Array<[number, number]> => {
  const baselineY = Number(/data-baseline-y="([\d.]+)"/.exec(svg)?.[1]);
  const perMmHg = Number(/data-px-per-mmhg="([\d.]+)"/.exec(svg)?.[1]);
  const pts = /<polyline points="([^"]+)"/.exec(svg)?.[1] ?? "";
  assert(Number.isFinite(baselineY) && Number.isFinite(perMmHg), "SVG must expose baseline + scale attrs");
  const parsed = pts
    .trim()
    .split(" ")
    .map((p) => p.split(",").map(Number) as [number, number]);
  const x0 = parsed[0][0]; // first sample is timeSec = 0, so its x is the origin
  return parsed.map(([x, y]) => [(x - x0) / pxPerSec, (baselineY - y) / perMmHg]);
};

// Count upward crossings of a threshold = number of expiratory cycles.
const cycleCount = (series: Array<[number, number]>, thresh: number) => {
  let n = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i - 1][1] < thresh && series[i][1] >= thresh) n++;
  }
  return n;
};

// --- Determinism + snapshot ----------------------------------------------
const canonical: CapnographySpec = { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16, durationSec: 15 };
const svgA = renderCapnographySvg(canonical);
assert(svgA === renderCapnographySvg(canonical), "same capnography spec must render byte-identical SVG");
assert(hash(svgA) === "00ef54f74e5f403f898ae060941d94d976a7e14fdda1c473191f8bafe22b6c00", "normal capnogram snapshot hash changed");

// --- normal: sharp plateau at etco2, returns to zero baseline -------------
{
  const spec: CapnographySpec = { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16 };
  assert(near(sampleU(spec, 0.45), 40, 0.5), "normal: end-expiration plateau must equal etco2");
  assert(sampleU(spec, 0.3) >= 36 && sampleU(spec, 0.4) >= 36, "normal: Phase III must hold a high near-flat plateau");
  assert(near(sampleU(spec, 0.7), 0, 0.01), "normal: inspiratory baseline must return to zero");
  assert(sampleU(spec, 0.02) < sampleU(spec, 0.3), "normal: Phase II upstroke must sit below the plateau (sharp alpha angle)");
}

// --- shark_fin: NO flat Phase III, continuous up-slope to etco2 -----------
{
  const spec: CapnographySpec = { kind: "capnography", pattern: "shark_fin", etco2: 45, respiratoryRate: 20, severity: 0.8 };
  const us = [0.1, 0.2, 0.3, 0.4, 0.44];
  for (let i = 1; i < us.length; i++) {
    assert(sampleU(spec, us[i]) > sampleU(spec, us[i - 1]) + 0.2, `shark_fin: expiration must keep rising (no flat plateau) at u=${us[i]}`);
  }
  assert(near(sampleU(spec, 0.45), 45, 0.5), "shark_fin: peak must reach etco2");
  assert(sampleU(spec, 0.25) < 40, "shark_fin: mid-expiration must sit well below etco2 (no early plateau)");
}

// --- flat: identically zero everywhere ------------------------------------
{
  const spec: CapnographySpec = { kind: "capnography", pattern: "flat", etco2: 0, respiratoryRate: 12 };
  for (const u of [0, 0.05, 0.25, 0.45, 0.5, 0.7, 0.99]) {
    assert(sampleU(spec, u) === 0, `flat: series must be identically 0 at u=${u}`);
  }
  const series = renderedSeries(renderCapnographySvg(spec));
  assert(series.every(([, v]) => near(v, 0, 0.01)), "flat: rendered trace must be a zero line");
}

// --- rosc: step-up from lowEtco2 to highEtco2 -----------------------------
{
  const spec: CapnographySpec = { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 10, durationSec: 15, rosc: { lowEtco2: 12, highEtco2: 40, stepAtSec: 8 } };
  const norm = normalizeSpec(spec);
  assert(getCurrentEtco2(4, norm) === 12, "rosc: amplitude before the step must be lowEtco2");
  assert(getCurrentEtco2(12, norm) === 40, "rosc: amplitude after the step must be highEtco2");
  assert(near(sampleU(spec, 0.45, 12), 12, 0.5), "rosc: pre-step plateau must equal lowEtco2");
  assert(near(sampleU(spec, 0.45, 40), 40, 0.5), "rosc: post-step plateau must equal highEtco2");
}

// --- rebreathing: inspiratory baseline fails to return to zero ------------
{
  const spec: CapnographySpec = { kind: "capnography", pattern: "rebreathing", etco2: 45, respiratoryRate: 16, baselineEtco2: 15 };
  assert(near(sampleU(spec, 0.7), 15, 0.01), "rebreathing: inspiratory minimum must equal baselineEtco2");
  assert(sampleU(spec, 0.7) > 0, "rebreathing: baseline must be elevated above zero");
  assert(near(sampleU(spec, 0.45), 45, 0.5), "rebreathing: plateau must still reach etco2");
}

// --- scaling: etco2 sets plateau height, RR sets cycle count --------------
{
  const low = renderedSeries(renderCapnographySvg({ kind: "capnography", pattern: "normal", etco2: 30, respiratoryRate: 12 }));
  const high = renderedSeries(renderCapnographySvg({ kind: "capnography", pattern: "normal", etco2: 50, respiratoryRate: 12 }));
  const peak = (s: Array<[number, number]>) => Math.max(...s.map(([, v]) => v));
  assert(near(peak(low), 30, 0.6), "scaling: etco2=30 plateau must render at 30 mmHg");
  assert(near(peak(high), 50, 0.6), "scaling: etco2=50 plateau must render at 50 mmHg");
  assert(peak(high) * pxPerMmHg > peak(low) * pxPerMmHg, "scaling: higher etco2 must render a taller plateau");

  const slow = renderedSeries(renderCapnographySvg({ kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 10, durationSec: 15 }));
  const fast = renderedSeries(renderCapnographySvg({ kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 20, durationSec: 15 }));
  const slowCycles = cycleCount(slow, 20);
  const fastCycles = cycleCount(fast, 20);
  assert(slowCycles > 0, "scaling: slow RR must produce at least one cycle");
  assert(fastCycles >= slowCycles * 2 - 1, `scaling: doubling RR must roughly double cycle count (slow=${slowCycles}, fast=${fastCycles})`);
}

console.log("capnography tests passed");
