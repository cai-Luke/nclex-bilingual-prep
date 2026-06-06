import { createHash } from "node:crypto";
import { rhythmClasses } from "../../src/schema";
import {
  ECG_SCALE,
  largeBoxSec,
  pxPerSec,
  renderRhythmStripSvg,
  secondsToPx,
  smallBoxSec,
} from "../../src/visuals/rhythmStrip";
import type { RhythmClass, RhythmStripVisual } from "../../src/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

const baseSpec: RhythmStripVisual = {
  kind: "rhythm_strip",
  rhythm: "sinus",
  rateBpm: 75,
  durationSec: 6,
  seed: 42,
  prSec: 0.2,
  qrsSec: 0.08,
  qtSec: 0.36,
};

const svg = renderRhythmStripSvg(baseSpec);
const sameSvg = renderRhythmStripSvg(baseSpec);
assert(svg === sameSvg, "same rhythm spec must render byte-identical SVG");
assert(hash(svg) === "ee2da945561e4b8db8c490883db7bd6c9697702dfbea6118d0fcee78b341e02d", "sinus rhythm strip snapshot hash changed");

const expectedLargeBoxPx = ECG_SCALE.largeBoxMm * ECG_SCALE.pxPerMm;
const expectedSmallBoxPx = ECG_SCALE.smallBoxMm * ECG_SCALE.pxPerMm;
assert(secondsToPx(largeBoxSec) === expectedLargeBoxPx, "0.2 seconds must equal one large ECG box");
assert(secondsToPx(smallBoxSec) === expectedSmallBoxPx, "0.04 seconds must equal one small ECG box");
assert(secondsToPx(baseSpec.prSec ?? 0) / pxPerSec === baseSpec.prSec, "PR seconds must round-trip through px scale");
assert(secondsToPx(baseSpec.prSec ?? 0) === expectedLargeBoxPx, "PR 0.20 seconds must render as one large box");

const rateForRhythm = (rhythm: RhythmClass) => {
  if (rhythm === "asystole") return 0;
  if (rhythm === "vfib") return 180;
  if (rhythm === "sinus_brady") return 48;
  if (rhythm === "sinus_tach") return 120;
  if (rhythm === "svt") return 180;
  if (rhythm === "vtach") return 160;
  if (rhythm === "aflutter") return 75;
  if (rhythm.startsWith("avb_")) return rhythm === "avb_3" ? 42 : 70;
  return 80;
};

rhythmClasses.forEach((rhythm) => {
  const rendered = renderRhythmStripSvg({
    kind: "rhythm_strip",
    rhythm,
    rateBpm: rateForRhythm(rhythm),
    durationSec: 6,
    seed: 7,
    atrialRateBpm: rhythm === "aflutter" ? 300 : undefined,
    conductionRatio: rhythm === "aflutter" ? 4 : undefined,
  });
  assert(rendered.includes(`data-rhythm="${rhythm}"`), `${rhythm} SVG should identify its rhythm`);
  assert(rendered.includes("<polyline"), `${rhythm} SVG should include a waveform polyline`);
});

console.log("rhythm-strip tests passed");
