import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { ANALYTE_DEFS } from "../../src/visuals/kinds/lab_trend/defs";
import {
  renderLabTrendSvg,
  selfCheckLabTrend,
  validateLabTrend,
} from "../../src/visuals/kinds/lab_trend";
import type { LabTrendSpec } from "../../src/visuals/kinds/lab_trend/types";

for (const [key, def] of Object.entries(ANALYTE_DEFS)) {
  assert.ok(def.refBand.adult, `${key} must retain a verified adult reference band`);
  assert.equal(def.refBand.peds_child, undefined, `${key} must not carry a coarse peds_child band`);
  assert.equal(def.refBand.peds_infant, undefined, `${key} must not carry a coarse peds_infant band`);
}

const pediatricDefaultBand: LabTrendSpec = {
  kind: "lab_trend",
  time: { unit: "hr", values: [0, 12, 24] },
  population: "peds_child",
  series: [{ analyte: "lactate", values: [4.2, 2.8, 1.9] }],
};
assert.ok(
  validateLabTrend(pediatricDefaultBand).some(error => error.code === "reference_band_unavailable"),
  "pediatric lab trends must not silently render an unverified coarse-bucket band",
);

const pediatricTrendOnly: LabTrendSpec = {
  ...pediatricDefaultBand,
  series: [{ analyte: "lactate", values: [4.2, 2.8, 1.9], showReferenceBand: false }],
};
assert.equal(
  validateLabTrend(pediatricTrendOnly).some(error => error.code === "reference_band_unavailable"),
  false,
  "pediatric trend-only use should remain available when the band is explicitly suppressed",
);
assert.ok(
  renderLabTrendSvg(pediatricTrendOnly).includes('data-kind="lab_trend"'),
  "pediatric trend-only specs should still render",
);

const flagErrors = selfCheckLabTrend(pediatricTrendOnly, {
  meta: {
    visual_justification: "The serial lactate trajectory is load-bearing.",
    expected_flags: [{ series: "lactate", at: 0, flag: "H" }],
  },
});
assert.ok(
  flagErrors.some(error => error.code === "self_check_flag_requires_reference_band"),
  "pediatric H/L assertions must fail closed without a verified band",
);

const stableErrors = selfCheckLabTrend(pediatricTrendOnly, {
  meta: {
    visual_justification: "The serial lactate trajectory is load-bearing.",
    expected_trend: [{ series: "lactate", direction: "stable", window: [0, 24] }],
  },
});
assert.ok(
  stableErrors.some(error => error.code === "self_check_stable_requires_reference_band"),
  "pediatric stable assertions must fail closed without a verified band width",
);

const directionalErrors = selfCheckLabTrend(pediatricTrendOnly, {
  meta: {
    visual_justification: "The serial lactate trajectory is load-bearing.",
    expected_trend: [{ series: "lactate", direction: "down", window: [0, 24] }],
  },
});
assert.deepEqual(directionalErrors, [], "up/down trend checks do not require a reference band");

assert.deepEqual(ANALYTE_DEFS.inr.refBand.adult, { low: 0.8, high: 1.2 }, "INR interval must pin the sourced healthy-population update");
assert.deepEqual(ANALYTE_DEFS.ptt.refBand.adult, { low: 22, high: 31 }, "aPTT interval must pin the current reagent interval");
assert.equal(ANALYTE_DEFS.ptt.sanity.max, 300, "aPTT sanity ceiling must no longer reject exact numeric results above 200 seconds");
assert.deepEqual(ANALYTE_DEFS.glucose.refBand.adult, { low: 65, high: 139 }, "glucose must use the non-fasting/random interval used by the general lab-trend lane");
assert.deepEqual(ANALYTE_DEFS.pao2.refBand.adult, { low: 75, high: 100 }, "PaO2 must pin the cited adult ABG interval");

const promotedBank = JSON.parse(
  readFileSync(new URL("../../banks/lab-canonical.json", import.meta.url), "utf8"),
) as { questions: Array<{ id: string; visual: LabTrendSpec; meta?: unknown }> };

for (const question of promotedBank.questions) {
  assert.deepEqual(
    validateLabTrend(question.visual),
    [],
    `${question.id} must remain structurally valid after the registry update`,
  );
  assert.deepEqual(
    selfCheckLabTrend(question.visual, question),
    [],
    `${question.id} expected trends and H/L flags must remain correct after the registry update`,
  );
}

console.log("lab trend reference-band tests passed");
