import { renderDivergingBars } from "../../src/visuals/primitives/divergingBars";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const simple = renderDivergingBars({
  bins: [{ label: "0800", positive: 120, negative: 350 }],
  positiveLabel: "Intake",
  negativeLabel: "Output",
  yAxisLabel: "mL",
});

assert(renderDivergingBars({
  bins: [{ label: "0800", positive: 120, negative: 350 }],
  positiveLabel: "Intake",
  negativeLabel: "Output",
  yAxisLabel: "mL",
}) === simple, "diverging bar rendering must be deterministic");

assert(simple.includes('data-axis-min="-500"'), "axis minimum must be symmetric around zero");
assert(simple.includes('data-axis-max="500"'), "axis maximum must be rounded to a clean symmetric bound");
assert(simple.includes('data-zero-y="123"'), "zero baseline must be exposed for geometry checks");
assert(!simple.includes('data-role="overlay-line"'), "overlay line must be omitted when overlay is absent");

const zeroNegative = renderDivergingBars({
  bins: [{ label: "0900", positive: 100, negative: 0 }],
  positiveLabel: "Intake",
  negativeLabel: "Output",
  yAxisLabel: "mL",
});
assert(zeroNegative.includes('data-role="positive-bar"'), "positive bar should render");
assert(!zeroNegative.includes('data-role="negative-bar"'), "zero negative magnitude must not render a downward bar");

const escaped = renderDivergingBars({
  bins: [{ label: "<0800 & 1200>", positive: 100, negative: 100 }],
  positiveLabel: "In <mL>",
  negativeLabel: "Out & drain",
  yAxisLabel: "mL <net>",
  overlay: {
    label: "Cumulative <net>",
    axisLabel: "net & mL",
    points: [{ binIndex: 0, value: 0 }],
  },
});
assert(escaped.includes("&lt;0800 &amp; 1200&gt;"), "bin labels must be XML-escaped");
assert(escaped.includes("In &lt;mL&gt;"), "legend labels must be XML-escaped");
assert(escaped.includes("mL &lt;net&gt;"), "axis labels must be XML-escaped");
assert(escaped.includes('data-role="overlay-line"'), "overlay line should render when overlay is present");

console.log("diverging-bars tests passed");
