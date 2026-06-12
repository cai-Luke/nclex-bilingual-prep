import { createHash } from "node:crypto";
import {
  buildVariabilitySeries,
  createChannelLayout,
  CTG_PX_PER_SEC,
  fetalHeartRateAt,
  SAMPLE_STEP_SEC,
  timeToX,
  uterineActivityAt,
  VARIABILITY_PEAK_TO_TROUGH_BPM,
} from "../../src/visuals/kinds/fetal_monitoring/channels";
import {
  fetalMonitoringModule,
  renderFetalMonitoringSvg,
  selfCheckFetalMonitoring,
  validateFetalMonitoring,
} from "../../src/visuals/kinds/fetal_monitoring";
import {
  ABRUPT_MAX_SEC,
  accelerationOffsetAt,
  accelerationMorphologyIsValid,
  decelerationOffsetAt,
  EARLY_EPS_SEC,
  GRADUAL_MIN_SEC,
  LATE_LAG_MIN_SEC,
  PROLONGED_MIN_SEC,
} from "../../src/visuals/kinds/fetal_monitoring/features";
import { fmt } from "../../src/visuals/primitives/graphPaper";
import type { Question } from "../../src/types";
import type {
  FetalMonitoringSpec,
  FhrVariability,
} from "../../src/visuals/kinds/fetal_monitoring/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

const hasCode = (spec: unknown, code: string) =>
  validateFetalMonitoring(spec as FetalMonitoringSpec).some((error) => error.code === code);
const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const selfCheckCodes = (spec: FetalMonitoringSpec, meta: Record<string, unknown>) =>
  selfCheckFetalMonitoring(spec, questionWithMeta(meta)).map((error) => error.code);
const justified = (expectedPattern: Record<string, unknown>) => ({
  visual_justification: "The learner must infer the tracing feature from the synchronized channels.",
  expected_pattern: expectedPattern,
});

const base: FetalMonitoringSpec = {
  kind: "fetal_monitoring",
  durationSec: 300,
  baselineFhr: 140,
  variability: "moderate",
  seed: 42,
  contractions: [{ peakSec: 90 }, { peakSec: 210, amplitudeMmHg: 65, durationSec: 75 }],
};

assert(hasCode({ ...base, baselineFhr: 400 }, "baseline_out_of_range"), "must validate baseline range");
assert(hasCode({ ...base, variability: "wandering" }, "invalid_variability"), "must validate variability vocabulary");
assert(hasCode({ ...base, contractions: [{ peakSec: 301 }] }, "contraction_out_of_range"), "must validate contraction timing");
assert(hasCode({ ...base, accelerations: [{ peakSec: 50, riseBpm: 999, durationSec: 20 }] }, "acceleration_out_of_range"), "must validate accelerations in Window 1");
assert(hasCode({ ...base, decelerations: [{ type: "nope", nadirSec: 50, depthBpm: 20, durationSec: 30 }] }, "invalid_decel_type"), "must validate deceleration vocabulary in Window 1");
assert(hasCode({ ...base, decelerations: [{ type: "early", nadirSec: 90, depthBpm: 20, durationSec: 60, contractionIndex: 9 }] }, "decel_contraction_index_invalid"), "must validate coupled deceleration indices");
assert(hasCode({ ...base, decelerations: [{ type: "variable", nadirSec: 80, depthBpm: 20, durationSec: 20, contractionIndex: 0 }] }, "variable_decel_coupled"), "must reject coupled variable decelerations");

const svg = renderFetalMonitoringSvg(base);
assert(svg === renderFetalMonitoringSvg(base), "same fetal monitoring spec must render byte-identical SVG");
assert(
  hash(svg) === "0053950c3f4f2752d3386398e688e88ccf0d1ade024e4555bd04dfa0012ffd83",
  "canonical fetal-monitoring SVG snapshot changed",
);
assert(!svg.includes("NaN") && !svg.includes("undefined"), "render must not leak NaN/undefined");
assert(svg.includes('data-panel="fhr"') && svg.includes('data-channel="fhr"'), "FHR panel must be present");
assert(svg.includes('data-panel="ua"') && svg.includes('data-channel="ua"'), "UA panel must be present");
assert(svg.includes(`data-px-per-sec="${CTG_PX_PER_SEC}"`), "render must expose the shared time scale");
const visibleText = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((match) => match[1].toLowerCase()).join(" ");
for (const verdict of ["early", "late", "variable", "prolonged", "deceleration"]) {
  assert(!visibleText.includes(verdict), `rendered text must not reveal the ${verdict} verdict`);
}

const categories: FhrVariability[] = ["absent", "minimal", "moderate", "marked"];
let previousRange = -1;
let previousSvg = "";
for (const category of categories) {
  const series = buildVariabilitySeries(300, category, 42);
  const range = Math.max(...series) - Math.min(...series);
  assert(
    Math.abs(range - VARIABILITY_PEAK_TO_TROUGH_BPM[category]) < 1e-9,
    `${category} variability must use its declared peak-to-trough range`,
  );
  assert(range > previousRange, `${category} variability must structurally exceed the preceding category`);
  const categorySvg = renderFetalMonitoringSvg({ ...base, variability: category });
  if (previousSvg) assert(categorySvg !== previousSvg, `${category} render must differ from the preceding category`);
  previousRange = range;
  previousSvg = categorySvg;
}

const layout = createChannelLayout(base.durationSec ?? 600);
for (const contraction of base.contractions ?? []) {
  const peakX = timeToX(contraction.peakSec, layout);
  const marker = new RegExp(
    `<circle[^>]*data-peak-sec="${contraction.peakSec}"[^>]*cx="${fmt(peakX)}"`,
  );
  assert(marker.test(svg), `contraction at ${contraction.peakSec}s must use the shared time coordinate`);

  const sampleTimes = Array.from(
    { length: Math.round((base.durationSec ?? 600) / SAMPLE_STEP_SEC) + 1 },
    (_, index) => index * SAMPLE_STEP_SEC,
  );
  const local = sampleTimes.filter((time) => Math.abs(time - contraction.peakSec) <= 20);
  const renderedPeakTime = local.reduce((best, time) =>
    uterineActivityAt(time, [contraction]) > uterineActivityAt(best, [contraction]) ? time : best,
  );
  assert(renderedPeakTime === contraction.peakSec, "UA gaussian must peak at the declared time");
}

const acceleration = { peakSec: 150, riseBpm: 20, durationSec: 30 };
assert(accelerationOffsetAt(150, acceleration) === 20, "acceleration must reach declared rise at peakSec");
assert(accelerationOffsetAt(130, acceleration) === 0, "acceleration must return to baseline outside its duration");
assert(accelerationMorphologyIsValid(acceleration), "term 15-by-15 acceleration must pass");
assert(
  selfCheckCodes(
    { ...base, accelerations: [{ peakSec: 150, riseBpm: 10, durationSec: 30 }] },
    justified({ accelerations_present: true }),
  ).includes("self_check_acceleration_morphology"),
  "sub-threshold acceleration morphology must fail",
);

const early: FetalMonitoringSpec = {
  ...base,
  contractions: [{ peakSec: 90 }],
  accelerations: [],
  decelerations: [
    {
      type: "early",
      nadirSec: 90 + EARLY_EPS_SEC,
      depthBpm: 30,
      durationSec: GRADUAL_MIN_SEC * 2,
      contractionIndex: 0,
    },
  ],
};
assert(
  selfCheckFetalMonitoring(early, questionWithMeta(justified({ decelerations: ["early"] }))).length === 0,
  "valid early phase must pass selfCheck",
);
const earlyWrongPhase = {
  ...early,
  decelerations: [{ ...early.decelerations![0], nadirSec: 90 + LATE_LAG_MIN_SEC + 10 }],
};
assert(
  selfCheckCodes(earlyWrongPhase, justified({ decelerations: ["early"] })).includes("self_check_early_phase"),
  "early deceleration shifted into late phase must fail",
);

const late: FetalMonitoringSpec = {
  ...base,
  variability: "minimal",
  contractions: [{ peakSec: 100 }],
  accelerations: [],
  decelerations: [
    {
      type: "late",
      nadirSec: 100 + LATE_LAG_MIN_SEC + 10,
      depthBpm: 30,
      durationSec: GRADUAL_MIN_SEC * 2,
      contractionIndex: 0,
    },
  ],
};
assert(
  selfCheckFetalMonitoring(late, questionWithMeta(justified({ decelerations: ["late"], variability: "minimal" }))).length === 0,
  "valid late phase must pass selfCheck",
);
const lateWrongPhase = {
  ...late,
  decelerations: [{ ...late.decelerations![0], nadirSec: 100 }],
};
assert(
  selfCheckCodes(lateWrongPhase, justified({ decelerations: ["late"] })).includes("self_check_late_phase"),
  "late deceleration centered at the contraction peak must fail",
);

const variable: FetalMonitoringSpec = {
  ...base,
  accelerations: [],
  decelerations: [
    { type: "variable", nadirSec: 75, depthBpm: 40, durationSec: 30 },
  ],
};
assert(
  selfCheckFetalMonitoring(variable, questionWithMeta(justified({ decelerations: ["variable"] }))).length === 0,
  "valid abrupt variable deceleration must pass selfCheck",
);
const variableTooGradual = {
  ...variable,
  decelerations: [{ ...variable.decelerations![0], durationSec: ABRUPT_MAX_SEC * 2 }],
};
assert(
  selfCheckCodes(variableTooGradual, justified({ decelerations: ["variable"] })).includes("self_check_variable_not_abrupt"),
  "gradual variable deceleration must fail",
);
assert(
  selfCheckCodes(
    { ...variable, decelerations: [{ ...variable.decelerations![0], depthBpm: 10 }] },
    justified({ decelerations: ["variable"] }),
  ).includes("self_check_variable_not_abrupt"),
  "sub-threshold variable deceleration depth must fail",
);

const prolonged: FetalMonitoringSpec = {
  ...base,
  accelerations: [],
  decelerations: [
    { type: "prolonged", nadirSec: 150, depthBpm: 35, durationSec: PROLONGED_MIN_SEC },
  ],
};
assert(
  selfCheckFetalMonitoring(prolonged, questionWithMeta(justified({ decelerations: ["prolonged"] }))).length === 0,
  "valid prolonged deceleration must pass selfCheck",
);
const prolongedTooShort = {
  ...prolonged,
  decelerations: [{ ...prolonged.decelerations![0], durationSec: 60 }],
};
assert(
  selfCheckCodes(prolongedTooShort, justified({ decelerations: ["prolonged"] })).includes("self_check_prolonged_duration"),
  "shortened prolonged deceleration must fail",
);
assert(
  selfCheckCodes(
    { ...prolonged, decelerations: [{ ...prolonged.decelerations![0], depthBpm: 10 }] },
    justified({ decelerations: ["prolonged"] }),
  ).includes("self_check_prolonged_duration"),
  "sub-threshold prolonged deceleration depth must fail",
);

assert(
  selfCheckCodes(early, justified({ decelerations: ["late"] })).includes("self_check_pattern_absent"),
  "expected deceleration type absent from the spec must fail",
);
assert(
  selfCheckCodes(late, justified({ variability: "moderate" })).includes("self_check_variability_mismatch"),
  "expected variability mismatch must fail",
);
assert(
  selfCheckCodes({ ...base, accelerations: [acceleration] }, justified({ accelerations_present: false })).includes("self_check_accel_mismatch"),
  "expected acceleration presence mismatch must fail",
);
assert(
  selfCheckCodes(base, justified({})).includes("self_check_no_keyed_pattern"),
  "empty expected_pattern must fail",
);
const missingMetaCodes = selfCheckFetalMonitoring(base, {} as Question).map((error) => error.code);
assert(
  missingMetaCodes.includes("self_check_missing_justification") &&
    missingMetaCodes.includes("self_check_no_keyed_pattern"),
  "missing meta must fail both necessity checks",
);

let malformed: ReturnType<typeof selfCheckFetalMonitoring> | undefined;
try {
  malformed = selfCheckFetalMonitoring({} as FetalMonitoringSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed fetal-monitoring selfCheck must not throw: ${String(error)}`);
}
assert(malformed.length === 0, "malformed fetal-monitoring selfCheck must return []");

for (const spec of fetalMonitoringModule.fixtures.valid) {
  const feature = spec.accelerations?.[0];
  if (feature) {
    const atPeak = fetalHeartRateAt(feature.peakSec, spec.baselineFhr, 0, [feature], []);
    assert(atPeak === spec.baselineFhr + feature.riseBpm, "render model must place acceleration peak at peakSec");
  }
  const deceleration = spec.decelerations?.[0];
  if (deceleration) {
    assert(
      decelerationOffsetAt(deceleration.nadirSec, deceleration) === -deceleration.depthBpm,
      "render model must place deceleration depth at nadirSec",
    );
  }
}

console.log("fetal-monitoring tests passed");
