import { createHash } from "node:crypto";
import { rhythmClasses } from "../../src/schema";
import { ECG_SCALE, largeBoxSec, pxPerSec, secondsToPx, smallBoxSec } from "../../src/visuals/primitives/graphPaper";
import { renderRhythmStripSvg, rhythmStripModule, selfCheckRhythmStrip } from "../../src/visuals/kinds/rhythmStrip";
import type { RhythmClass, RhythmStripVisual } from "../../src/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

const questionWithMeta = (meta: Record<string, unknown>) => ({
  id: "q",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "pacemaker",
  difficulty: "medium",
  stem: { en: "e", zh: "z" },
  rationale: { correct: { en: "e", zh: "z" } },
  testTakingStrategy: { en: "e", zh: "z" },
  glossary: [],
  options: [{ id: "A", en: "a", zh: "a" }],
  correct: ["A"],
  meta,
});

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

const capturedPacer: RhythmStripVisual = {
  kind: "rhythm_strip",
  rhythm: "asystole",
  rateBpm: 0,
  durationSec: 6,
  pacer: {
    mode: "ventricular",
    setRateBpm: 60,
    spikeTimesSec: [1, 2, 3, 4, 5],
    capturedSpikeTimesSec: [1, 2, 3, 4, 5],
    finding: "capture",
  },
};
const pacerSvg = renderRhythmStripSvg(capturedPacer);
assert(pacerSvg === renderRhythmStripSvg(capturedPacer), "pacer strip must render byte-identical SVG");
assert(!pacerSvg.includes("NaN") && !pacerSvg.includes("undefined"), "pacer strip must not leak invalid coordinates");

const pacerCodes = (spec: RhythmStripVisual) => rhythmStripModule.validate(spec).map((error) => error.code);
assert(
  pacerCodes({
    ...capturedPacer,
    pacer: { ...capturedPacer.pacer!, spikeTimesSec: [], capturedSpikeTimesSec: [] },
  }).includes("pacer_spikes_required"),
  "pacer validation must reject empty spike lists",
);
assert(
  pacerCodes({
    ...capturedPacer,
    pacer: { ...capturedPacer.pacer!, capturedSpikeTimesSec: [1, 2, 9] },
  }).includes("pacer_captured_spike_not_subset"),
  "pacer validation must reject captured spikes outside spikeTimesSec",
);

const justified = (pacerFinding: string) =>
  questionWithMeta({
    visual_justification: "The learner must inspect pacing spike timing and capture on the strip.",
    expected: { pacerFinding },
  });
assert(selfCheckRhythmStrip(capturedPacer, justified("capture")).length === 0, "complete capture must pass selfCheck");
assert(
  selfCheckRhythmStrip(
    {
      ...capturedPacer,
      pacer: { ...capturedPacer.pacer!, capturedSpikeTimesSec: [1, 3, 5] },
    },
    justified("capture"),
  ).some((error) => error.code === "self_check_capture_incomplete"),
  "capture finding must fail when not every spike captures",
);
assert(
  selfCheckRhythmStrip(
    { ...capturedPacer, pacer: { ...capturedPacer.pacer!, finding: "failure_to_capture" } },
    justified("failure_to_capture"),
  ).some((error) => error.code === "self_check_failure_to_capture_absent"),
  "failure-to-capture finding must fail when every spike captures",
);

const failureToPace: RhythmStripVisual = {
  ...capturedPacer,
  pacer: { ...capturedPacer.pacer!, spikeTimesSec: [1, 2, 5], capturedSpikeTimesSec: [1, 2, 5], finding: "failure_to_pace" },
};
assert(selfCheckRhythmStrip(failureToPace, justified("failure_to_pace")).length === 0, "asystole failure-to-pace gap must pass selfCheck");
assert(
  selfCheckRhythmStrip(
    { ...capturedPacer, pacer: { ...capturedPacer.pacer!, finding: "failure_to_pace" } },
    justified("failure_to_pace"),
  ).some((error) => error.code === "self_check_failure_to_pace_absent"),
  "failure-to-pace finding must fail without a programmed-rate spike gap",
);

const failureToSense: RhythmStripVisual = {
  kind: "rhythm_strip",
  rhythm: "sinus",
  rateBpm: 75,
  durationSec: 6,
  seed: 7,
  pacer: {
    mode: "ventricular",
    setRateBpm: 60,
    spikeTimesSec: [1.02, 2.8],
    capturedSpikeTimesSec: [2.8],
    finding: "failure_to_sense",
  },
};
assert(selfCheckRhythmStrip(failureToSense, justified("failure_to_sense")).length === 0, "failure-to-sense spike on T wave must pass selfCheck");
assert(
  selfCheckRhythmStrip(
    { ...failureToSense, pacer: { ...failureToSense.pacer!, spikeTimesSec: [0.2, 1.3], capturedSpikeTimesSec: [] } },
    justified("failure_to_sense"),
  ).some((error) => error.code === "self_check_failure_to_sense_absent"),
  "failure-to-sense finding must fail when no spike lands on an intrinsic QRS/T window",
);
assert(
  selfCheckRhythmStrip(capturedPacer, questionWithMeta({})).some((error) => error.code === "self_check_no_expected_cue"),
  "pacer selfCheck must require meta.expected.pacerFinding",
);
assert(
  selfCheckRhythmStrip(capturedPacer, justified("failure_to_capture")).some((error) => error.code === "self_check_pacer_finding_mismatch"),
  "pacer selfCheck must reject expected finding mismatches",
);
assert(selfCheckRhythmStrip(baseSpec, questionWithMeta({})).length === 0, "non-pacer rhythm strips must no-op in selfCheck");

console.log("rhythm-strip tests passed");
