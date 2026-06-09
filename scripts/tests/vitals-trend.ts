import { renderVitalsTrendSvg, validateVitalsTrend, selfCheckVitalsTrend } from "../../src/visuals/kinds/vitals_trend";
import { renderLineChart } from "../../src/visuals/primitives/lineChart";
import type { VitalsTrendSpec } from "../../src/visuals/kinds/vitals_trend/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

// --- Determinism ----------------------------------------------
const canonical: VitalsTrendSpec = {
  kind: "vitals_trend",
  timepointsHr: [0, 2, 4],
  series: [
    { vital: "hr", values: [80, 90, 110] },
    { vital: "map", values: [90, 80, 65] }
  ]
};

const svgA = renderVitalsTrendSvg(canonical);
assert(svgA === renderVitalsTrendSvg(canonical), "same vitals_trend spec must render byte-identical SVG");

// --- Validation ----------------------------------------------
const errs = validateVitalsTrend({
  kind: "vitals_trend",
  timepointsHr: [0, 2, 4],
  series: [
    { vital: "hr", values: [80, 90, 999] }
  ]
});
assert(errs.length > 0 && errs[0].code === "value_out_of_range", "should catch out of range values");

const errsLength = validateVitalsTrend({
  kind: "vitals_trend",
  timepointsHr: [0, 2, 4],
  series: [
    { vital: "hr", values: [80, 90] }
  ]
});
assert(errsLength.length > 0 && errsLength[0].code === "values_length_mismatch", "should catch length mismatches");

const badSeriesNull = validateVitalsTrend({
  kind: "vitals_trend", timepointsHr: [0], series: [null] as any
});
assert(badSeriesNull.some(e => e.code === "series_entry_invalid"), "should reject null series entry");

const badSeriesStr = validateVitalsTrend({
  kind: "vitals_trend", timepointsHr: [0], series: ["bad"] as any
});
assert(badSeriesStr.some(e => e.code === "series_entry_invalid"), "should reject string series entry");

const badSeriesObj = validateVitalsTrend({
  kind: "vitals_trend", timepointsHr: [0], series: [{}] as any
});
assert(badSeriesObj.some(e => e.code === "invalid_vital_key"), "should catch missing vital key gracefully");

// --- selfCheck MAP calculation -------------------------------
const goodMap: VitalsTrendSpec = {
  kind: "vitals_trend",
  timepointsHr: [0],
  series: [
    { vital: "sbp", values: [120] },
    { vital: "dbp", values: [80] },
    { vital: "map", values: [93] } // 80 + 40/3 = 93.33 -> 93
  ]
};
const goodCheck = selfCheckVitalsTrend(goodMap, {});
assert(goodCheck.length === 0, "correct MAP check should pass");

const badMap: VitalsTrendSpec = {
  kind: "vitals_trend",
  timepointsHr: [0],
  series: [
    { vital: "sbp", values: [120] },
    { vital: "dbp", values: [80] },
    { vital: "map", values: [100] } // incorrect
  ]
};
const badCheck = selfCheckVitalsTrend(badMap, {});
assert(badCheck.length > 0 && badCheck[0].code === "self_check_map_failed", "incorrect MAP should fail selfCheck");

// --- selfCheck trend verification (canonical: question.meta.expected_trend array) ------
const badTrendSpec: VitalsTrendSpec = {
  kind: "vitals_trend",
  timepointsHr: [0, 2, 4],
  series: [
    { vital: "map", values: [90, 90, 95] } // supposed to go down but goes up
  ]
};
const trendCheck = selfCheckVitalsTrend(badTrendSpec, {
  meta: { expected_trend: [{ series: "map", direction: "down", window: [0, 4] }] }
});
assert(trendCheck.length > 0 && trendCheck[0].code === "self_check_trend_failed", "should fail trend check if not matching");

// legacy "vital" key should also be accepted during migration period
const trendCheckLegacy = selfCheckVitalsTrend(badTrendSpec, {
  meta: { expected_trend: [{ vital: "map", direction: "down", window: [0, 4] }] }
});
assert(trendCheckLegacy.length > 0 && trendCheckLegacy[0].code === "self_check_trend_failed", "legacy vital key should still trigger trend check");

// --- Defensive selfCheck -------------------------------
const defensiveCheck = selfCheckVitalsTrend({} as VitalsTrendSpec, {});
assert(defensiveCheck.length === 0, "malformed spec should not throw in selfCheck");
const defensiveTrendCheck = selfCheckVitalsTrend({
  kind: "vitals_trend", timepointsHr: [0], series: []
} as VitalsTrendSpec, { meta: { expected_trend: "bad" } });
assert(defensiveTrendCheck.length === 0, "malformed expected_trend should not throw in selfCheck");

// --- Temperature bounds -------------------------------
const tempCErrs = validateVitalsTrend({
  kind: "vitals_trend",
  timepointsHr: [0],
  tempUnit: "C",
  series: [{ vital: "temp", values: [90] }]
});
assert(tempCErrs.some(e => e.code === "value_out_of_range"), "should reject 90 °C");

const tempFErrs = validateVitalsTrend({
  kind: "vitals_trend",
  timepointsHr: [0],
  tempUnit: "F",
  series: [{ vital: "temp", values: [102] }]
});
assert(tempFErrs.length === 0, "should accept 102 °F");

// --- showReferenceBand validation -------------------------------
const refBandErrs = validateVitalsTrend({
  kind: "vitals_trend",
  timepointsHr: [0],
  series: [{ vital: "hr", values: [80], showReferenceBand: "yes" as any }]
});
assert(refBandErrs.some(e => e.code === "invalid_show_reference_band"), "should reject non-boolean showReferenceBand");

// --- XSS Escaping -------------------------------
const xssSvg = renderLineChart({
  xAxis: { label: "<script>alert(1)</script>", min: 0, max: 10 },
  yAxisLeft: { label: "", min: 0, max: 10 },
  series: [{ label: "<svg onload=1>", unit: "&", points: [] }]
});
assert(!xssSvg.includes("<script>"), "script tags must be escaped");
assert(xssSvg.includes("&lt;script&gt;"), "escaped script tags should be present");
assert(xssSvg.includes("&lt;svg"), "svg tags in labels must be escaped");

// --- Primitive: reference band geometry -------------------------------
// Single left series, band low=60/high=100 on a 0..100 axis at default 600x300.
// margins: top=30 bottom=50 left=60 right=30 (no right axis) -> plotHeight=220, plotWidth=510.
// mapY(100)=30, mapY(60)=118 -> rect y=30, height=88; x=60, width=510.
const bandSvg = renderLineChart({
  xAxis: { label: "t", min: 0, max: 10 },
  yAxisLeft: { label: "", min: 0, max: 100 },
  series: [{ label: "HR", unit: "bpm", points: [{ x: 0, y: 80 }], referenceBand: { low: 60, high: 100 } }],
});
assert(
  bandSvg.includes(`<rect x="60" y="30" width="510" height="88" fill="#f1f5f9" opacity="0.6"/>`),
  "reference band rect geometry must match the given low/high",
);

// --- Primitive: dual-axis placement -------------------------------
// Identical data value (y=50) must land at different pixel-y on left vs right axis.
// With both axes present margins right=60 -> plotWidth=480, plotHeight=220.
// left axis 0..100: mapY(50)=140 ; right axis 0..200: mapY(50)=195.
const dualSvg = renderLineChart({
  xAxis: { label: "t", min: 0, max: 10 },
  yAxisLeft: { label: "", min: 0, max: 100 },
  yAxisRight: { label: "", min: 0, max: 200 },
  series: [
    { label: "L", unit: "a", axis: "left", points: [{ x: 2, y: 50 }] },
    { label: "R", unit: "b", axis: "right", points: [{ x: 8, y: 50 }] },
  ],
});
assert(dualSvg.includes(`cx="156" cy="140"`), "left-axis point must map on the left scale");
assert(dualSvg.includes(`cx="444" cy="195"`), "right-axis point must map on the right scale");

console.log("vitals-trend tests passed");
