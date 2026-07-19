import {
  renderVitalsTrendSvg,
  validateVitalsTrend,
  selfCheckVitalsTrend,
  VITALS_TREND_LAYOUT,
} from "../../src/visuals/kinds/vitals_trend";
import { renderLineChart } from "../../src/visuals/primitives/lineChart";
import type { VitalsTrendSpec } from "../../src/visuals/kinds/vitals_trend/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const countOccurrences = (value: string, needle: string): number => value.split(needle).length - 1;

const tableTexts = (svg: string): string[] => {
  const table = svg.slice(svg.indexOf('data-vitals-table="true"'));
  return [...table.matchAll(/<text [^>]*>([^<]*)<\/text>/g)].map((match) => match[1]);
};

const assertLegendCells = (svg: string, expectedEntries: number) => {
  const entries = [...svg.matchAll(
    /<g class="vitals-legend-entry" data-vital="([^"]+)" data-axis="[^"]+" data-cell-x="(\d+)" data-cell-width="(\d+)">([^]*?)<\/g>/g,
  )];
  assert(entries.length === expectedEntries, `fixture must render ${expectedEntries} panel-local legend entries`);
  for (const entry of entries) {
    const cellX = Number(entry[2]);
    const cellWidth = Number(entry[3]);
    const body = entry[4];
    assert(cellX >= 60 && cellX + cellWidth <= 540, `${entry[1]} legend cell must remain inside x=60..540`);
    assert(body.includes(`<line x1="${cellX}"`) && body.includes(`x2="${cellX + 16}"`), `${entry[1]} marker line must remain inside its cell`);
    assert(body.includes(`<circle cx="${cellX + 8}"`), `${entry[1]} marker center must remain inside its cell`);
    assert(body.includes(`<text x="${cellX + 22}"`), `${entry[1]} text anchor must remain inside its cell`);
  }
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

assert(svgA.includes('data-vitals-panel="hemodynamics"'), "hr/map must render the hemodynamics panel");
assert(!svgA.includes('data-vitals-panel="respiratory-oxygenation"'), "hr/map must omit the respiratory panel");
assert(!svgA.includes('data-vitals-panel="temperature"'), "hr/map must omit the temperature panel");
assert(svgA.includes('data-vital="hr" data-axis="right"'), "HR must use the right axis when pressure is present");
assert(svgA.includes('data-vital="map" data-axis="left"'), "MAP must use the left pressure axis");
assert(svgA.includes("Blood pressure (mmHg)"), "hemodynamics must label the pressure axis");
assert(svgA.includes("HR (bpm)"), "hemodynamics must label the HR axis");

const hrTemp: VitalsTrendSpec = {
  kind: "vitals_trend",
  time: { unit: "hr", values: [0, 1, 2, 4] },
  series: [
    { vital: "temp", values: [40.1, 39.8, 38.9, 38.2] },
    { vital: "hr", values: [152, 138, 115, 94] },
  ],
};
const hrTempSvg = renderVitalsTrendSvg(hrTemp);
assert(
  hrTempSvg.indexOf('data-vitals-panel="hemodynamics"') < hrTempSvg.indexOf('data-vitals-panel="temperature"'),
  "hr/temp panels must render in A/C order",
);
assert(!hrTempSvg.includes('data-vitals-panel="respiratory-oxygenation"'), "hr/temp must omit Panel B");

const forcingSix: VitalsTrendSpec = {
  kind: "vitals_trend",
  time: { unit: "hr", values: [0, 2, 4, 6] },
  population: "adult",
  series: [
    { vital: "hr", values: [96, 110, 122, 130], showReferenceBand: true },
    { vital: "sbp", values: [126, 114, 100, 92], showReferenceBand: true },
    { vital: "dbp", values: [78, 72, 64, 58], showReferenceBand: true },
    { vital: "map", values: [94, 86, 76, 69], showReferenceBand: true },
    { vital: "rr", values: [20, 24, 28, 30], showReferenceBand: true },
    { vital: "temp", values: [38.4, 39.1, 39.3, 38.8], showReferenceBand: true },
  ],
  caption: { en: "caption must remain external" },
};
const forcingSvg = renderVitalsTrendSvg(forcingSix);
assert(
  forcingSvg.indexOf('data-vitals-panel="hemodynamics"') <
    forcingSvg.indexOf('data-vitals-panel="respiratory-oxygenation"') &&
    forcingSvg.indexOf('data-vitals-panel="respiratory-oxygenation"') <
    forcingSvg.indexOf('data-vitals-panel="temperature"'),
  "forcing fixture must render A/B/C in fixed order",
);
assert(!forcingSvg.includes("caption must remain external"), "caption text must not be duplicated inside the SVG");
assert(
  countOccurrences(forcingSvg, 'fill="#f1f5f9" opacity="0.6"') === 2,
  "multi-series panels must suppress bands while the one-series temperature and RR panels retain one each",
);
assertLegendCells(forcingSvg, 6);

const fullSeven: VitalsTrendSpec = {
  kind: "vitals_trend",
  time: { unit: "min", values: [0, 15, 30, 60] },
  series: [
    { vital: "hr", values: [124, 112, 98, 88] },
    { vital: "sbp", values: [90, 100, 112, 118] },
    { vital: "dbp", values: [54, 60, 66, 72] },
    { vital: "map", values: [66, 73, 81, 87] },
    { vital: "rr", values: [26, 24, 20, 18] },
    { vital: "spo2", values: [97, 98, 98, 99] },
    { vital: "temp", values: [37.2, 37.15, 37.1, 37.05] },
  ],
};
const fullSvg = renderVitalsTrendSvg(fullSeven);
assert(fullSvg.includes('data-vital="rr" data-axis="left"'), "RR must use the left respiratory axis");
assert(fullSvg.includes('data-vital="spo2" data-axis="right"'), "SpO₂ must use the right respiratory axis");
for (const title of ["Blood pressure (mmHg)", "HR (bpm)", "RR (/min)", "SpO₂ (%)", "Temperature (°C)"]) {
  assert(fullSvg.includes(title), `full fixture must render axis title ${title}`);
}
assert(countOccurrences(fullSvg, 'cx="540"') === 7, "every panel must share plot-right x=540 for final points");

assertLegendCells(fullSvg, 7);

const hemodynamicEnd = fullSvg.indexOf('data-vitals-panel="respiratory-oxygenation"');
const hemodynamicSvg = fullSvg.slice(fullSvg.indexOf('data-vitals-panel="hemodynamics"'), hemodynamicEnd);
const pressurePolylines = [...hemodynamicSvg.matchAll(/<polyline [^>]+>/g)].map((match) => match[0]);
assert(pressurePolylines.length === 4, "hemodynamics must render four ordered polylines");
assert(!pressurePolylines[1].includes("stroke-dasharray"), "SBP polyline must remain solid");
assert(pressurePolylines[2].includes('stroke-dasharray="6 4"'), "DBP polyline must use dash 6 4");
assert(
  /data-vital="dbp"[^]*?<line [^>]*stroke-dasharray="6 4"/.test(hemodynamicSvg),
  "DBP legend marker must use dash 6 4",
);

const fullTableTexts = tableTexts(fullSvg);
assert(
  JSON.stringify(fullTableTexts) === JSON.stringify([
    "Vital sign", "0 min", "15 min", "30 min", "60 min",
    "HR (bpm)", "124", "112", "98", "88",
    "BP (mmHg)", "90/54", "100/60", "112/66", "118/72",
    "MAP (mmHg)", "66", "73", "81", "87",
    "RR (/min)", "26", "24", "20", "18",
    "SpO₂ (%)", "97", "98", "98", "99",
    "Temperature (°C)", "37.2", "37.15", "37.1", "37.05",
  ]),
  "flowsheet headers, rows, and source values must render in exact cell order",
);
assert(!fullTableTexts.includes("SBP (mmHg)") && !fullTableTexts.includes("DBP (mmHg)"), "combined BP must not emit phantom pressure rows");
const sparseTableTexts = tableTexts(hrTempSvg);
for (const absentRow of ["BP (mmHg)", "SBP (mmHg)", "DBP (mmHg)", "MAP (mmHg)", "RR (/min)", "SpO₂ (%)"]) {
  assert(!sparseTableTexts.includes(absentRow), `sparse hr/temp fixture must omit ${absentRow}`);
}

const expectedFullHeight =
  (VITALS_TREND_LAYOUT.headingHeight + 2 * VITALS_TREND_LAYOUT.legendRowHeight + VITALS_TREND_LAYOUT.standardChartHeight) +
  VITALS_TREND_LAYOUT.panelGap +
  (VITALS_TREND_LAYOUT.headingHeight + VITALS_TREND_LAYOUT.legendRowHeight + VITALS_TREND_LAYOUT.standardChartHeight) +
  VITALS_TREND_LAYOUT.panelGap +
  (VITALS_TREND_LAYOUT.headingHeight + VITALS_TREND_LAYOUT.legendRowHeight + VITALS_TREND_LAYOUT.temperatureChartHeight) +
  VITALS_TREND_LAYOUT.chartTableGap +
  VITALS_TREND_LAYOUT.tableHeaderHeight + 6 * VITALS_TREND_LAYOUT.tableRowHeight;
assert(
  fullSvg.includes(`viewBox="0 0 600 ${expectedFullHeight}"`),
  "outer viewBox height must equal the exact measured panel, gap, and table sum",
);

const adultSingle = renderVitalsTrendSvg({
  kind: "vitals_trend",
  timepointsHr: [0, 1],
  series: [{ vital: "hr", values: [80, 90] }],
});
const pediatricSvg = renderVitalsTrendSvg({
  kind: "vitals_trend",
  population: "peds_child",
  timepointsHr: [0, 1],
  series: [{ vital: "hr", values: [110, 105] }],
});
assert(countOccurrences(adultSingle, 'fill="#f1f5f9" opacity="0.6"') === 1, "one-series adult panel must render one band");
assert(!pediatricSvg.includes('fill="#f1f5f9" opacity="0.6"'), "pediatric population must suppress reference bands");
assert(!svgA.includes('fill="#f1f5f9" opacity="0.6"'), "any multi-series panel must render zero bands");

const adultMultiExplicit = renderVitalsTrendSvg({
  ...canonical,
  series: canonical.series.map((series) => ({ ...series, showReferenceBand: true })),
});
assert(!adultMultiExplicit.includes('fill="#f1f5f9" opacity="0.6"'), "explicit true must not override panel exclusivity");

const noBandSingle = renderVitalsTrendSvg({
  kind: "vitals_trend",
  timepointsHr: [0, 1],
  series: [{ vital: "hr", values: [80, 90], showReferenceBand: false }],
});
assert(!noBandSingle.includes('fill="#f1f5f9" opacity="0.6"'), "explicit false must suppress a one-series adult band");

const defaultTemp = renderVitalsTrendSvg({
  kind: "vitals_trend",
  timepointsHr: [0, 1],
  series: [{ vital: "temp", values: [37, 38] }],
});
const fahrenheitTemp = renderVitalsTrendSvg({
  kind: "vitals_trend",
  timepointsHr: [0, 1],
  tempUnit: "F",
  series: [{ vital: "temp", values: [98.6, 101.3] }],
});
assert(defaultTemp.includes("Temperature (°C)"), "omitted tempUnit must default to Celsius");
assert(fahrenheitTemp.includes("Temperature (°F)"), "synthetic Fahrenheit fixture must render °F");

const nullPopulationSvg = renderVitalsTrendSvg({
  kind: "vitals_trend",
  timepointsHr: [0, 1],
  series: [{ vital: "hr", values: [80, 90] }],
  population: null as unknown as VitalsTrendSpec["population"],
});
assert(!nullPopulationSvg.includes('fill="#f1f5f9" opacity="0.6"'), "null population must suppress reference bands");

const nullPopulationErrs = validateVitalsTrend({
  ...canonical,
  population: null as unknown as VitalsTrendSpec["population"],
});
assert(nullPopulationErrs.some(e => e.code === "invalid_population"), "null population must fail runtime vocabulary validation");

const unknownPopulationErrs = validateVitalsTrend({
  ...canonical,
  population: "geriatric" as VitalsTrendSpec["population"],
});
assert(unknownPopulationErrs.some(e => e.code === "invalid_population"), "unknown population must fail runtime vocabulary validation");

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

const pediatricExplicitBandErrs = validateVitalsTrend({
  kind: "vitals_trend",
  population: "peds_child",
  timepointsHr: [0],
  series: [{ vital: "hr", values: [110], showReferenceBand: true }],
});
assert(
  pediatricExplicitBandErrs.some(e => e.code === "reference_band_population_unsupported"),
  "should reject an explicitly enabled pediatric reference band",
);

const pediatricImplicitBandErrs = validateVitalsTrend({
  kind: "vitals_trend",
  population: "peds_infant",
  timepointsHr: [0],
  series: [{ vital: "hr", values: [140] }],
});
assert(
  !pediatricImplicitBandErrs.some(e => e.code === "reference_band_population_unsupported"),
  "should accept an omitted pediatric reference-band flag",
);

// --- XSS Escaping -------------------------------
const xssSvg = renderLineChart({
  xAxis: { label: "<script>alert(1)</script>", min: 0, max: 10 },
  yAxisLeft: { label: "", min: 0, max: 10 },
  series: [{ label: "<svg onload=1>", unit: "&", points: [] }]
});
assert(!xssSvg.includes("<script>"), "script tags must be escaped");
assert(xssSvg.includes("&lt;script&gt;"), "escaped script tags should be present");
assert(xssSvg.includes("&lt;svg"), "svg tags in labels must be escaped");

const noLegendSvg = renderLineChart({
  xAxis: { label: "t", min: 0, max: 1 },
  yAxisLeft: { label: "y", min: 0, max: 1 },
  series: [{ label: "Hidden legend", unit: "u", points: [{ x: 0, y: 0 }] }],
  showLegend: false,
});
assert(!noLegendSvg.includes("Hidden legend"), "showLegend=false must suppress only the primitive legend");

const dashedPrimitiveSvg = renderLineChart({
  xAxis: { label: "t", min: 0, max: 1 },
  yAxisLeft: { label: "y", min: 0, max: 1 },
  series: [{ label: "Dashed", unit: "u", points: [{ x: 0, y: 0 }], strokeDash: true }],
});
assert(
  countOccurrences(dashedPrimitiveSvg, 'stroke-dasharray="6 4"') === 2,
  "strokeDash=true must dash the primitive polyline and enabled legend marker",
);

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
