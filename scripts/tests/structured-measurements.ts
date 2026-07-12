import assert from "node:assert/strict";
import {
  formatStructuredMeasurementValue,
  renderStructuredMeasurementsSvg,
  serializeStructuredMeasurements,
} from "../../src/structuredMeasurements";
import { isIdentityScale, parseMeasurementValue } from "../../src/measurementUnitPolicy";
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

assert.equal(
  formatStructuredMeasurementValue("wbc", { columnId: "ed", value: "14,200", unit: "/uL" }),
  "14.2 ×10³/µL",
  "CBC display should suppress same-magnitude SI parentheses for /uL aliases too",
);

assert.equal(
  formatStructuredMeasurementValue("creatinine", { columnId: "ed", value: "1.0", unit: "mg/dL" }),
  "1.0 mg/dL",
  "primary-unit values should preserve significant trailing zeros",
);

assert.equal(
  formatStructuredMeasurementValue("inr", { columnId: "ed", value: "1.0", unit: "(ratio)" }),
  "1.0",
  "ratio placeholder units should not render and significant zeros should remain",
);

assert.equal(
  formatStructuredMeasurementValue("ph", { columnId: "ed", value: "7.32", unit: "(unitless)" }),
  "7.32",
  "unitless placeholder units should not render",
);

assert.equal(
  formatStructuredMeasurementValue("temp", { columnId: "ed", value: "-40", unit: "°F" }),
  "-40 °F (-40 °C)",
  "coincident numeric values must not suppress an affine conversion",
);

assert.equal(isIdentityScale("wbc", "×10³/µL", "×10⁹/L"), true);
assert.equal(isIdentityScale("temp", "°F", "°C"), false);
assert.equal(isIdentityScale("calcium", "mg/dL", "mmol/L"), false);

assert.equal(parseMeasurementValue(">150"), null, "comparator values must not parse as scalar measurements");
assert.equal(parseMeasurementValue("18,000"), 18000, "comma stripping should remain supported");

assert.equal(
  formatStructuredMeasurementValue("ptt", { columnId: "ed", value: "150", unit: "seconds", bound: ">" }),
  ">150 seconds",
  "bounded values should render their comparator from the typed bound field",
);

assert.equal(
  formatStructuredMeasurementValue("magnesium", { columnId: "ed", value: "1.4", unit: "mEq/L", bound: ">" }),
  ">1.7 mg/dL",
  "bounded values should suppress the secondary-unit parenthetical",
);

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

const sparse: StructuredMeasurements = {
  panels: [{
    kind: "labs",
    columns: [
      { id: "prior", label: { en: "PACU (6 h prior)", zh: "麻醉恢复室（6小时前）" } },
      { id: "current", label: { en: "Current", zh: "当前" } },
    ],
    rows: [
      { key: "phosphate", label: { en: "Phosphate", zh: "血磷" }, values: [{ columnId: "prior", value: "2.8", unit: "mg/dL" }] },
      { key: "glucose", label: { en: "Glucose", zh: "血糖" }, values: [
        { columnId: "prior", value: "156", unit: "mg/dL" },
        { columnId: "current", value: "142", unit: "mg/dL" },
      ] },
    ],
  }],
};
const sparseSvg = renderStructuredMeasurementsSvg(sparse, "always");
assert(sparseSvg.includes("PACU (6 h prior)"), "explicit prior column label should render");
assert(sparseSvg.includes("Current / 当前"), "explicit current column label should render");
assert(sparseSvg.includes("Phosphate / 血磷"), "sparse prior-only row should render");
assert(!sparseSvg.includes("undefined"), "missing current sparse cell must remain blank rather than render undefined");

console.log("structured measurements tests passed");
