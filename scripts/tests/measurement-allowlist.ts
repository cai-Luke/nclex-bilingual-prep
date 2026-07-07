import { strict as assert } from "node:assert";
import { MEASUREMENT_ALLOWLIST, ALLOWLIST_KEYS } from "../../src/measurementAllowlist";
import { ANALYTE_DEFS } from "../../src/visuals/kinds/lab_trend/defs";
import { VITAL_DEFS } from "../../src/visuals/kinds/vitals_trend/defs";

for (const [key, def] of Object.entries(VITAL_DEFS)) {
  const got = MEASUREMENT_ALLOWLIST[key];
  assert.ok(got, `${key} missing from measurement allowlist`);
  assert.equal(got.kind, "vital", `${key} should be vital`);
  assert.equal(got.canonicalUnit, def.unit, `${key} canonicalUnit drift`);
  assert.deepEqual(got.sanity, def.range, `${key} sanity drift`);
  const expectedSourceUnits = key === "temp" ? [def.unit, "°F", "F", "C"] : [def.unit];
  assert.deepEqual(got.acceptedSourceUnits, expectedSourceUnits, `${key} acceptedSourceUnits drift`);
}

for (const [key, def] of Object.entries(ANALYTE_DEFS)) {
  const got = MEASUREMENT_ALLOWLIST[key];
  assert.ok(got, `${key} missing from measurement allowlist`);
  assert.equal(got.kind, "lab", `${key} should be lab`);
  assert.equal(got.canonicalUnit, def.canonicalUnit, `${key} canonicalUnit drift`);
  assert.deepEqual(got.sanity, def.sanity, `${key} sanity drift`);
  assert.deepEqual(got.acceptedSourceUnits, [def.canonicalUnit, ...def.altUnits], `${key} acceptedSourceUnits drift`);
}

assert.equal(
  ALLOWLIST_KEYS.size,
  Object.keys(VITAL_DEFS).length + Object.keys(ANALYTE_DEFS).length + 2,
  "ALLOWLIST_KEYS should contain every registry key plus structured-only keys",
);

assert.ok(Object.isFrozen(MEASUREMENT_ALLOWLIST), "allowlist table should be frozen");
assert.ok(Object.isFrozen(MEASUREMENT_ALLOWLIST.platelets), "allowlist members should be frozen");
assert.ok(Object.isFrozen(MEASUREMENT_ALLOWLIST.platelets.acceptedSourceUnits), "acceptedSourceUnits should be frozen");
assert.throws(() => {
  (MEASUREMENT_ALLOWLIST.platelets as { canonicalUnit: string }).canonicalUnit = "×10⁹/L";
}, TypeError, "mutating a frozen allowlist member should throw");

assert.deepEqual(
  MEASUREMENT_ALLOWLIST.wbc.acceptedSourceUnits,
  ["×10³/µL", "K/µL", "/µL", "/μL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
  "WBC units should pin conventional-canonical, source-permissive CBC policy",
);
assert.deepEqual(
  MEASUREMENT_ALLOWLIST.platelets.acceptedSourceUnits,
  ["×10³/µL", "K/µL", "/µL", "/μL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
  "platelet units should pin conventional-canonical, source-permissive CBC policy",
);
assert.equal(MEASUREMENT_ALLOWLIST.wbc.canonicalUnit, "×10³/µL", "WBC display canonical should remain compact conventional");
assert.equal(MEASUREMENT_ALLOWLIST.platelets.canonicalUnit, "×10³/µL", "platelet display canonical should remain compact conventional");
assert.ok(MEASUREMENT_ALLOWLIST.magnesium.acceptedSourceUnits.includes("mEq/L"), "magnesium should accept mEq/L as a source unit");
assert.ok(MEASUREMENT_ALLOWLIST.calcium.acceptedSourceUnits.includes("mEq/L"), "total calcium should accept mEq/L as a source unit");
assert.ok(MEASUREMENT_ALLOWLIST.ionized_calcium.acceptedSourceUnits.includes("mEq/L"), "ionized calcium should accept mEq/L as a source unit");
assert.ok(MEASUREMENT_ALLOWLIST.temp.acceptedSourceUnits.includes("°F"), "temperature should accept Fahrenheit source values");
assert.equal(MEASUREMENT_ALLOWLIST.troponin_i.kind, "lab", "troponin_i should be structured-only lab measurement");
assert.equal(MEASUREMENT_ALLOWLIST.troponin_i.canonicalUnit, "ng/mL", "troponin_i canonical unit should be ng/mL");
assert.deepEqual(MEASUREMENT_ALLOWLIST.troponin_i.acceptedSourceUnits, ["ng/mL", "µg/L"], "troponin_i accepted units should be pinned");
assert.equal(MEASUREMENT_ALLOWLIST.sao2.kind, "lab", "sao2 should be structured-only lab/ABG measurement");
assert.deepEqual(MEASUREMENT_ALLOWLIST.sao2.acceptedSourceUnits, ["%"], "sao2 accepted units should be pinned");
assert.equal("troponin_i" in ANALYTE_DEFS, false, "troponin_i must not widen lab_trend analytes");
assert.equal("sao2" in ANALYTE_DEFS, false, "sao2 must not widen lab_trend analytes");
assert.equal("sao2" in VITAL_DEFS, false, "sao2 must not widen vitals_trend keys");

console.log("measurement allowlist tests passed");
