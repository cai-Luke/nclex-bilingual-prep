import type { Question } from "../../src/types";
import {
  burnMapModule,
  renderBurnMapSvg,
  selfCheckBurnMap,
  validateBurnMap,
} from "../../src/visuals/kinds/burn_map";
import {
  BURN_REGION_KEYS,
  REGION_GEOMETRY,
  TBSA_PCT,
  type BurnPopulation,
} from "../../src/visuals/kinds/burn_map/regions";
import type { BurnMapSpec } from "../../src/visuals/kinds/burn_map/types";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const adult: BurnMapSpec = {
  kind: "burn_map",
  population: "adult",
  burns: ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;
const codes = (errors: ReturnType<typeof validateBurnMap>) => errors.map((error) => error.code);

for (const population of ["adult", "pediatric"] as BurnPopulation[]) {
  const total = BURN_REGION_KEYS.reduce((sum, key) => sum + TBSA_PCT[population][key], 0);
  assert(total === 100, `${population} Rule-of-Nines table must sum to 100, got ${total}`);
}

assert(codes(validateBurnMap({ ...adult, population: "neonate" as never })).includes("invalid_population"), "invalid population must fail");
assert(codes(validateBurnMap({ ...adult, burns: ["left_foot" as never] })).includes("invalid_region"), "invalid region must fail");
assert(codes(validateBurnMap({ ...adult, burns: ["trunk_anterior", "trunk_anterior"] })).includes("duplicate_region"), "duplicate region must fail");

const fullChain = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must sum the shaded regions and use the result in Parkland arithmetic.",
  weight_kg: 70,
  round: 0,
  derived_values_keyed: {
    tbsa_pct: 36,
    parkland_total_ml: 10080,
    parkland_first8h_ml: 5040,
    parkland_rate_first8h_ml_hr: 630,
  },
}));
assert(fullChain.length === 0, `correct adult arithmetic must pass: ${JSON.stringify(fullChain)}`);

const mismatch = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must sum the shaded regions.",
  derived_values_keyed: { tbsa_pct: 40 },
}));
assert(mismatch.some((error) => error.code === "self_check_value_mismatch"), "wrong keyed TBSA must fail");

const missingWeight = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must calculate Parkland volume.",
  derived_values_keyed: { parkland_total_ml: 10080 },
}));
assert(missingWeight.some((error) => error.code === "self_check_weight_missing"), "Parkland derivation without weight must fail");

const noKeyed = selfCheckBurnMap(adult, questionWithMeta({
  visual_justification: "The learner must inspect the map.",
  derived_values_keyed: { unknown: 36 },
}));
assert(noKeyed.some((error) => error.code === "self_check_no_keyed_values"), "meta without recognized key must fail");

const pediatric = selfCheckBurnMap({
  kind: "burn_map",
  population: "pediatric",
  burns: ["head_anterior", "head_posterior", "trunk_anterior"],
}, questionWithMeta({
  visual_justification: "The learner must use the pediatric table selected by the map.",
  derived_values_keyed: { tbsa_pct: 36 },
}));
assert(pediatric.length === 0, `pediatric table must drive recompute: ${JSON.stringify(pediatric)}`);

const matchingBlank = selfCheckBurnMap(adult, {
  itemType: "fill_in_blank",
  meta: {
    visual_justification: "The learner must enter the computed TBSA.",
    round: 0,
    derived_values_keyed: { tbsa_pct: 36 },
  },
  blanks: [{ id: "tbsa", numeric: { value: 36, tolerance: 0 } }],
} as unknown as Question);
assert(matchingBlank.length === 0, `numeric blank matching a derived value must pass: ${JSON.stringify(matchingBlank)}`);

const wrongBlank = selfCheckBurnMap(adult, {
  itemType: "fill_in_blank",
  meta: {
    visual_justification: "The learner must enter the computed TBSA.",
    round: 0,
    derived_values_keyed: { tbsa_pct: 36 },
  },
  blanks: [{ id: "tbsa", numeric: { value: 35.6, tolerance: 0 } }],
} as unknown as Question);
assert(
  wrongBlank.some((error) => error.code === "self_check_answer_value_mismatch"),
  "numeric blank not matching any present rounded derived value must fail",
);

let malformed: ReturnType<typeof selfCheckBurnMap> | undefined;
try {
  malformed = selfCheckBurnMap({} as BurnMapSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformed?.length === 0, "malformed selfCheck input must return []");

const svg = renderBurnMapSvg(adult);
assert(renderBurnMapSvg(adult) === svg, "burn-map rendering must be deterministic");
assert(svg.includes('data-kind="burn_map"'), "burn map must identify its kind");
assert(svg.includes('data-region="trunk_anterior"') && svg.includes('fill="#dc2626" fill-opacity="0.55"'), "burned region must use solid translucent red");
assert(svg.includes('data-region="head_anterior"') && svg.includes('fill="#f1f5f9"'), "unburned region must use neutral fill");
assert(svg.includes('clip-path="url(#burn-posterior-clip)"'), "posterior detail lines must be clipped to the body silhouette");
assert(svg.includes('stroke="#64748b" stroke-width="1"'), "burn map outlines must stay lighter than selected burn fills");
assert(svg.includes('viewBox="0 0 850 640"'), "burn map must reserve a label band below the full-size figures");
assert(svg.includes('data-region="genitalia"') && svg.includes("M 235,320 Q 250,310 265,320"), "genitalia must render as a distinct selectable region");
assert(svg.includes("L 125,330 Q 115,340 107,325"), "anterior arms must include readable hand termini");
assert(svg.includes('data-region="arm_l_posterior" d="M 540,180'), "posterior left arm must render on the patient's left side");
assert(svg.includes('data-region="leg_l_posterior" d="M 550,310'), "posterior left leg must render on the patient's left side");
assert(svg.includes('M 235,145 Q 215,145 180,155'), "anterior trunk must keep a broad curved shoulder yoke");
assert(svg.includes('M 585,145 Q 565,145 530,155'), "posterior trunk must keep a parallel curved shoulder yoke");
assert(svg.includes('M 230,125 Q 250,140 270,125'), "anterior view must include a low chin/jaw orientation cue");
assert(!svg.includes('M 230,106 Q 250,128 270,106'), "anterior view must not include the old higher face/chin/mouth cue");
assert(svg.includes('M 600,170 L 600,310'), "posterior view must include a faint central spine orientation cue");
assert(svg.includes('M 600,320 L 600,350'), "posterior view must include clipped orientation lines");

for (const key of BURN_REGION_KEYS) {
  const singleRegionSvg = renderBurnMapSvg({ kind: "burn_map", population: "adult", burns: [key] });
  assert(
    singleRegionSvg.includes(`data-region="${key}"`) && singleRegionSvg.includes(`data-region="${key}" d="${REGION_GEOMETRY[key].d}" fill="#dc2626" fill-opacity="0.55"`),
    `${key} must visibly select its own keyed region`,
  );
  const selectedFills = singleRegionSvg.match(/fill="#dc2626" fill-opacity="0.55"/g) ?? [];
  assert(selectedFills.length === 1, `${key} single-region render must shade exactly one keyed fill`);
}

const visibleLabels = Array.from(svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g), (match) => match[1]);
assert(
  visibleLabels.every((label) => !/%|Parkland|10080|5040|630|36/.test(label)),
  `visible SVG labels must not reveal derived answers: ${JSON.stringify(visibleLabels)}`,
);
assert(
  JSON.stringify(burnMapModule.allowedItemTypes) ===
    JSON.stringify(["multiple_choice", "select_all", "matrix", "fill_in_blank"]),
  "burn_map placement must include numeric fill_in_blank",
);

console.log("burn-map tests passed");
