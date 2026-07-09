import assert from "node:assert/strict";
import {
  formatStructuredMeasurementValue,
  renderStructuredMeasurementsSvg,
  serializeStructuredMeasurements,
} from "../../src/structuredMeasurements";
import { parseMeasurementValue } from "../../src/measurementUnitPolicy";
import type { StructuredMeasurements } from "../../src/types";

const measurements: StructuredMeasurements = {
  panels: [{
    kind: "labs",
    columns: [{ id: "ed", label: { en: "ED", zh: "急诊" } }],
    rows: [
      {
        key: "platelets",
        label: { en: "Platelets", zh: "血小板" },
        values: [{ columnId: "ed", value: "18,000", unit: "/µL" }],
      },
      {
        key: "magnesium",
        label: { en: "Magnesium", zh: "镁" },
        values: [{ columnId: "ed", value: "1.4", unit: "mEq/L", context: "post_intervention" }],
      },
    ],
  }],
};

assert.equal(
  formatStructuredMeasurementValue("platelets", { columnId: "ed", value: "18,000", unit: "/µL" }),
  "18 ×10³/µL",
  "CBC raw counts should suppress same-magnitude SI parentheses",
);

assert.equal(parseMeasurementValue(">150"), null, "comparator values must not parse as scalar measurements");
assert.equal(parseMeasurementValue("18,000"), 18000, "comma stripping should remain supported");

assert.equal(
  formatStructuredMeasurementValue("magnesium", { columnId: "ed", value: "1.4", unit: "mEq/L" }),
  "1.7 mg/dL (0.7 mmol/L)",
  "magnesium mEq/L should render conventional first with mmol/L in parentheses",
);

assert.equal(
  formatStructuredMeasurementValue("temp", { columnId: "ed", value: "99.1", unit: "°F" }),
  "99.1 °F (37.3 °C)",
  "Fahrenheit source temperatures should stay US-conventional first with Celsius in parentheses",
);

assert.equal(
  formatStructuredMeasurementValue("temp", { columnId: "ed", value: "39.2", unit: "C" }),
  "102.6 °F (39.2 °C)",
  "Celsius source temperatures should render Fahrenheit first with Celsius in parentheses",
);

const serialized = serializeStructuredMeasurements(measurements);
assert(serialized, "structured measurements should serialize");
assert(serialized.en.includes("Platelets (ED): 18 ×10³/µL"));
assert(serialized.en.includes("Magnesium (ED): 1.7 mg/dL (0.7 mmol/L) [post-intervention]"));
assert(serialized.zh.includes("血小板 (急诊): 18 ×10³/µL"));
assert(serialized.zh.includes("镁 (急诊): 1.7 mg/dL (0.7 mmol/L) [干预后]"));

const svg = renderStructuredMeasurementsSvg(measurements, "always");
assert(svg.startsWith("<svg "), "renderer should emit a standalone SVG");
assert(svg.includes("Platelets / 血小板"), "always mode should include bilingual row labels");
assert(svg.includes("18 ×10³/µL"), "renderer should include formatted values");
assert(!svg.includes("18 ×10⁹/L"), "renderer should suppress same-magnitude SI parentheses");

console.log("structured measurements tests passed");
