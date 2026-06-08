import { createHash } from "node:crypto";
import { renderVitalsTrendSvg, validateVitalsTrend, selfCheckVitalsTrend } from "../../src/visuals/kinds/vitals_trend";
import type { VitalsTrendSpec } from "../../src/visuals/kinds/vitals_trend/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

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

// --- selfCheck trend verification -------------------------------
const expectedTrend = { vital: "map", direction: "down", window: [0, 4] };
const badTrendSpec: VitalsTrendSpec = {
  kind: "vitals_trend",
  timepointsHr: [0, 2, 4],
  series: [
    { vital: "map", values: [90, 90, 95] } // supposed to go down but goes up
  ]
};
const trendCheck = selfCheckVitalsTrend(badTrendSpec, { metadata: { expectedTrend } });
assert(trendCheck.length > 0 && trendCheck[0].code === "self_check_trend_failed", "should fail trend check if not matching");

// --- Defensive selfCheck -------------------------------
const defensiveCheck = selfCheckVitalsTrend({} as VitalsTrendSpec, {});
assert(defensiveCheck.length === 0, "malformed spec should not throw in selfCheck");
const defensiveTrendCheck = selfCheckVitalsTrend({
  kind: "vitals_trend", timepointsHr: [0], series: []
} as VitalsTrendSpec, { metadata: { expectedTrend: "bad" } });
assert(defensiveTrendCheck.length === 0, "malformed expectedTrend should not throw in selfCheck");

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
import { renderLineChart } from "../../src/visuals/primitives/lineChart";
const xssSvg = renderLineChart({
  xAxis: { label: "<script>alert(1)</script>", min: 0, max: 10 },
  yAxisLeft: { label: "", min: 0, max: 10 },
  series: [{ label: "<svg onload=1>", unit: "&", points: [] }]
});
assert(!xssSvg.includes("<script>"), "script tags must be escaped");
assert(xssSvg.includes("&lt;script&gt;"), "escaped script tags should be present");
assert(xssSvg.includes("&lt;svg"), "svg tags in labels must be escaped");

console.log("vitals-trend tests passed");
